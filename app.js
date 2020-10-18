const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://me-jsramverk.rinnegard.me/']);

io.on('connection', function (socket) {
    io.emit('new user', {
        username: "Server Message",
        message: "New user connected",
        time: Date.now()
    });

    socket.on('chat message', function (message) {
        io.emit('chat message', message);
        io.emit('new user', {
            username: "Server Message",
            message: "New user connected",
            time: Date.now()
        });
    });
});

server.listen(3000);
