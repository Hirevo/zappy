import * as io from "socket.io-client"
import {IGeneralCommandCom, ITileCommand} from "./ICom";

interface Error {
    code: string
}

export default class SocketCom {
    private sock: SocketIOClient.Socket;
    private isError: boolean;
    private isRefused: boolean;

    constructor(port: number, host: string = "127.0.0.1", onConnect?: () => void, onError?: () => void, onData?: (resp: string) => void) {
        this.isError = false;
        this.isRefused = false;
        this.sock = io.connect("http://" + host + ":" + port);

        if (onConnect)
            this.sock.on('connect', () => {
                setTimeout(() => {
                    if (!this.isError)
                        onConnect();
                    else if (onError)
                        onError();
                }, 200);
            });
        this.sock.on('my_error', (error: Error) => {
            this.isError = true;
            this.onError(error);
        });
        this.sock.on('disconnect', (reason: string) => {
           console.log(reason);
           // alert('disconnect');
        });

        if (onData)
            this.sock.on('my_data', onData);
    }

    public setOnData(fnt: (resp: string) => void) {
        this.sock.removeListener('my_data');
        this.sock.on('my_data', fnt);
    }

    private onError(error: Error) {
        console.error(error);
        if (error.code === "ECONNREFUSED")
            this.isRefused = true;
        if (error.code === "DISCONNECTED" && !this.isRefused) {
            alert("You have been disconnected from the server");
            window.location.href = "/";
        }
    }

    private onData(msg: String) {
        // console.log(msg);
    }

    public send(str: String) {
        this.sock.emit('my_data', str);
    }

    public sendJSON(json: ITileCommand | IGeneralCommandCom) {
        let str = JSON.stringify(json) + '\n';
        this.sock.emit('my_data', str);
    }
}