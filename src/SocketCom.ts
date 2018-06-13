// import net, { Socket } from "net"

// import SocketIO from "socket.io-client"

export default class SocketCom {
    private sock: SocketIOClient.Socket;

    constructor(port : number, host : string = "127.0.0.1") {
        this.sock = io.connect("http://localhost:33333");
        // this.sock = SocketIO.
        // this.sock = net.connect(port, host, () => {
        //     console.log('Connected to server');
        // });
    }

    send(str: String) {
        this.sock.emit('data', str);
    }
}