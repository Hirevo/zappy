# coding = utf-8

import enum
import re

import src.classes.com.Client as COM
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.Vector import Vector
from src.misc import my_log, my_print


class Cmd(enum.Enum):
    Forward = "Forward"
    Right = "Right"
    Left = "Left"
    Look = "Look"
    Inventory = "Inventory"
    Broadcast = "Broadcast"
    Connect_nbr = "Connect_nbr"
    Fork = "Fork"
    Eject = "Eject"
    Take = "Take"
    Set = "Set"
    IncantationStart = "Incantation"
    IncantationStop = None


class CmdCost(enum.Enum):
    Forward = int(10)
    Right = int(10)
    Left = int(10)
    Look = int(10)
    Inventory = int(2)
    Broadcast = int(10)
    Connect_nbr = int(1)
    Fork = int(45)
    Eject = int(10)
    Take = int(10)
    Set = int(10)
    Incantation = int(310)


class Resources(enum.Enum):
    Food = "food"
    Linemate = "linemate"
    Deraumere = "deraumere"
    Sibur = "sibur"
    Mendiane = "mendiane"
    Phiras = "phiras"
    Thystame = "thystame"


requirement = {
    2: (1, {Resources.Linemate: 1}),
    3: (2, {Resources.Linemate: 1, Resources.Deraumere: 1, Resources.Sibur: 1}),
    4: (2, {Resources.Linemate: 2, Resources.Sibur: 1, Resources.Phiras: 2}),
    5: (4, {Resources.Linemate: 1, Resources.Deraumere: 1, Resources.Sibur: 2,
            Resources.Phiras: 1}),
    6: (4, {Resources.Linemate: 1, Resources.Deraumere: 2, Resources.Sibur: 1,
            Resources.Mendiane: 3}),
    7: (6, {Resources.Linemate: 1, Resources.Deraumere: 2, Resources.Sibur: 3,
            Resources.Phiras: 1}),
    8: (6, {Resources.Linemate: 2, Resources.Deraumere: 2, Resources.Sibur: 2,
            Resources.Mendiane: 2, Resources.Phiras: 2, Resources.Thystame: 1}),
}


class GameException(Exception):

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr("GameException : " + self.value)


def defaultError():
    raise GameException("An unexpected result come from a safe call")


def defaultOk():
    raise GameException("An unexpected result come from a safe call")


def defaultConnectNbr(nbr):
    ant.current_nbr = int(nbr)


class Message(object):

    def __init__(self, dir_nbr, text):
        dir_conv = {
            0: Vector(0, 0),
            1: Vector(0, 1),
            2: Vector(-1, 1),
            3: Vector(-1, 0),
            4: Vector(-1, -1),
            5: Vector(0, -1),
            6: Vector(1, -1),
            7: Vector(1, 0),
            8: Vector(1, 1)
        }
        self.text = text
        self.dir = dir_conv[dir_nbr]

    def __repr__(self):
        return repr(self.dir.__repr__() + " : " + self.text)


class MessageBox(object):
    def __init__(self):
        self._messages = []

    def __iter__(self):
        return self

    def __next__(self):
        if len(self._messages):
            return self._messages.pop(0)
        raise StopIteration

    def __getitem__(self, item):
        return self.__messages[item]

    def append(self, msg):
        self._messages.append(msg)


class Controller(object):
    """
    All callbacks take no arguments until it's specify
    """

    def __init__(self):
        self._answersCallers = {
            Cmd.Forward: self._applyDefault,
            Cmd.Right: self._applyDefault,
            Cmd.Left: self._applyDefault,
            Cmd.Look: self._applyLook,
            Cmd.Inventory: self._applyInventory,
            Cmd.Broadcast: self._applyDefault,
            Cmd.Connect_nbr: self._applyArgCurrentNbr,
            Cmd.Fork: self._applyDefault,
            Cmd.Eject: self._applyDefault,
            Cmd.Take: self._applyTake,
            Cmd.Set: self._applySet,
            Cmd.IncantationStart: self._applyDefault,
            Cmd.IncantationStop: self._applyArgIncantation,
        }
        self._cmdQueue = []
        self._takeQueue = []
        self._setQueue = []
        self._writeQueue = []
        self.msgQueue = MessageBox()

    def _write(self, value):
        if len(self._cmdQueue) >= 10:
            self._writeQueue.append(value)
        else:
            COM.cli.write(value)

    def forward(self, callback):
        #my_log("Forward")
        cmd = Cmd.Forward
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def right(self, callback):
        #my_log("Right")
        cmd = Cmd.Right
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def left(self, callback):
        #my_log("Left")
        cmd = Cmd.Left
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def look(self, callback):
        """
        :param callback: (look list of str) -> void
            :return: void
        """
        cmd = Cmd.Look
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def inventory(self, callback):
        """
        :param callback: (inventory dict: dict(Resources)) -> void
        :return: void
        """
        cmd = Cmd.Inventory
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def broadcast(self, msg, callback):
        cmd = Cmd.Broadcast
        #my_log("msg : ", msg)
        self._write(' '.join((cmd.value, msg)))
        self._cmdQueue.append((cmd, callback, defaultError))

    def connect_number(self, callback=defaultConnectNbr):
        """
        :param callback: (connect_numbers) -> void x 1
        :return:
        """
        cmd = Cmd.Connect_nbr
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def fork(self, callback):
        cmd = Cmd.Fork
        self._write(cmd.value)
        self._cmdQueue.append((cmd, callback, defaultError))

    def eject(self, ok, ko):
        cmd = Cmd.Eject
        self._write(cmd.value)
        self._cmdQueue.append((cmd, ok, ko))

    def take(self, object, ok, ko):
        """
        :param callback: (object: str) -> void x 2
        :return:
        """
        if type(object) != Resources:
            raise Exception("Invalid type")
        cmd = Cmd.Take
        self._write(' '.join((cmd.value, object.value)))
        self._cmdQueue.append((cmd, ok, ko))
        self._takeQueue.append(object.value)

    def set(self, object, ok, ko):
        """
        :param callback: (object: str) -> void x 2
        :return:
        """
        if type(object) != Resources:
            raise Exception("Invalid type")
        cmd = Cmd.Set
        self._write(' '.join((cmd.value, object.value)))
        self._cmdQueue.append((cmd, ok, ko))
        self._setQueue.append(object.value)

    def incantation(self, ok_start, ko_start, ok_end, ko_end, write=True):
        """
        :param ok_start: () -> void
        :param ko_start: () -> void
        :param ok_end: (lvl: int) -> void
        :param ko_end: () -> void
        :return:
        """
        cmd = Cmd.IncantationStart
        if write:
            self._write(cmd.value)
        self._cmdQueue.append((cmd, ok_start, ko_start))
        self._cmdQueue.append((Cmd.IncantationStop, ok_end, ko_end))

    def _applyDefault(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        cmd_item[1]()

    def _applyArgOK(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        cmd_item[1](server_answer)

    def _applyArgIncantation(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        cmd_item[1](int(server_answer[-1:]))

    def _applyArgCurrentNbr(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        cmd_item[1](int(server_answer))

    def _applySet(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2](self._setQueue.pop(0))
        cmd_item[1](self._setQueue.pop(0))

    def _applyTake(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2](self._takeQueue.pop(0))
        cmd_item[1](self._takeQueue.pop(0))

    def _applyLook(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        server_answer = server_answer[1:-1].split(',')
        for i in range(len(server_answer)):
            server_answer[i] = server_answer[i].split(' ')
            while '' in server_answer[i]:
                server_answer[i].remove('')
        cmd_item[1](server_answer)

    def _applyInventory(self, server_answer, cmd_item):
        if server_answer == "ko":
            return cmd_item[2]()
        server_answer = server_answer[1:-1].split(', ')
        while '' in server_answer:
            server_answer.remove('')
        for i in range(len(server_answer)):
            server_answer[i] = server_answer[i].split(' ')
            while '' in server_answer[i]:
                server_answer[i].remove('')
        try:
            items = {Resources(v[0]): int(v[1]) for v in server_answer}
        except Exception as e:
            my_print(server_answer)
            my_print(e)
        cmd_item[1](items)

    def applyTop(self, server_answer):
        try:
            match = re.findall("^message\s+(\d),\s+(.*)$", server_answer)
            if match:
                #my_log("msg : ", server_answer)
                self.msgQueue.append(Message(int(match[0][0]), match[0][1]))
            else:
                value = self._cmdQueue.pop(0)
                self._answersCallers[value[0]](server_answer, value)
            return True, len(match) > 0
        except IndexError as e:
            return False, False

    def flushCmds(self):
        while len(self._cmdQueue) - len(self._writeQueue) < 10 and len(
                self._writeQueue):
            value = self._writeQueue.pop(0)
            COM.cli.write(value)

    def hasBufferizedCmds(self):
        return len(self._writeQueue) != 0

    def checkEndGame(self, args):
        for elem in args:
            if elem == "dead":
                raise GameException("You died")


controller = Controller()
