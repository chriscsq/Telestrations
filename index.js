const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('game/', { extensions: ['html'] }));

server.listen(80, () => {
    console.log('Game server started on port 80');
});

io.on('connect', socket => {
    console.log('Client connected');

    socket.on('create-room', () => {
        let randomCode = 'ASDF';
        socket.emit('create-room', { code: randomCode });
    });

    socket.on('join-room', data => {
        let response = {
            success: true,
            code: data.code,
        };
        socket.emit('join-room', response);
    });

    socket.on('login', data => {
        let response = {
            success: true,
            user: data.username,
            usericon: 'fa-camera',
        };
        socket.emit('login', response);
    });

    socket.on('register', data => {
        let response = {
            success: true,
            user: data.username,
            usericon: 'fa-camera',
        };
        socket.emit('register', response);
    });
    socket.on('GAME_SETTINGS', data => {
        alert("SOCKET DETECTED"); //debug
        let response = {
            numPlayers: data.numPlayers,
            timeLimit: data.timeLimit,
        };
        socket.emit('settings', response);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});