#!/usr/bin/node

const net = require('net');

const server = require('socket.io');
const io = new server(33333);

io.on('connection', (sock) => {
    let cli = null;
    cli = net.connect(33334, "127.0.0.1", () => {
        console.log('Connected');
    });
    sock.on('data', (data) => {
        console.log(data);
        cli.write(data);
    });
})