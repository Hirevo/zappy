# coding = utf-8
import os
import socket
import select
import enum


def init_client(ip, port):
    global cli
    cli = Client(ip, port)
    return cli


class PollStatus(enum.Enum):
    DIN = (select.POLLIN | select.POLLHUP)
    DOUT = (select.POLLOUT | select.POLLHUP)
    DINOUT = (select.POLLIN | select.POLLOUT | select.POLLHUP)
    IN = select.POLLIN
    OUT = select.POLLOUT
    INOUT = (select.POLLIN | select.POLLOUT)


class ClientException(Exception):

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr("ClientException : " + self.value)


class Client:

    def __init__(self, ip, port):
        self._handlers = {
            select.POLLHUP: self._disconnection,
            select.POLLOUT: self._write,
            select.POLLIN: self._read,
        }
        self._readQueue = []
        self._writeQueue = []
        self._port = port
        self._ip = ip
        self._poll = select.poll()
        self._sock = None
        self._buffer = ""
        self._readSize = 4096

    def __enter__(self):
        self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._poll.register(self._sock.fileno(), PollStatus.DIN.value)
        try:
            self._sock.connect((self._ip, self._port))
        except ConnectionRefusedError as e:
            raise ClientException(e.__str__())
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._poll.unregister(self._sock.fileno())
        self._sock.close()
        self._sock = None

    def write(self, msg):
        if len(self._writeQueue) == 0:
            self._poll.modify(self._sock.fileno(), PollStatus.DINOUT.value)
        self._writeQueue.append(msg)

    def poll(self, timeout=None):
        events = self._poll.poll(timeout)
        attrs = 0
        for fd, event in events:
            if fd != self._sock.fileno():
                raise ClientException("An external fd was registered in the polling object")
            for key, fct in self._handlers.items():
                if (key & event) != 0:
                    attrs |= key
                    fct()
        return attrs

    @staticmethod
    def _disconnection():
        raise ClientException("Invalid disconnection")

    def _write(self):
        if len(self._writeQueue) == 0:
            raise ClientException("Nothing to write in the buffer")
        msg = self._writeQueue.pop(0)
        #my_log"-> write : ", msg)
        os.write(self._sock.fileno(), str(str(msg) + '\n').encode())
        if len(self._writeQueue) == 0:
            self._poll.modify(self._sock.fileno(), PollStatus.DIN.value)

    def _read(self):
        msg = os.read(self._sock.fileno(), self._readSize)
        #my_log"-> read : ", msg)
        if len(msg) == 0:
            self._disconnection()
        self._buffer += msg.decode()
        if len(self._buffer) > self._readSize:
            self._buffer = self._buffer[len(self._buffer) - self._readSize - 1:]
        if self._buffer.find("\n") >= 0:
            split = self._buffer.split("\n")
            while '' in split:
                split.remove('')
            self._readQueue += split
            self._buffer = ""

    def consult(self):
        save = self._readQueue
        self._readQueue = []
        return save


cli = None
