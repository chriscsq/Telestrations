const EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
};

let express = require('express');
let path = require('path');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(express.static('game/', { extensions: ['html'] }));

server.listen(80, () => {
    console.log('Game server started on port 80');
});

io.on(EVENTS.CONNECT, socket => {
    console.log('Client connected');

    socket.on(EVENTS.DISCONNECT, () => {
        console.log('Client disconnected');
    });
});