const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const admin = require('firebase-admin');
const serviceAccount = require('./telestrations-45c76-firebase-adminsdk-g3nms-3d9cefae9d.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telestrations-45c76.firebaseio.com'
});
const db = admin.firestore();

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
        db.collection('players')
            .where('username', '==', data.username)
            .where('password', '==', data.password)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size === 1) {
                    let doc = querySnapshot.docs[0].data();
                    socket.emit('login', {
                        success: true,
                        user: doc.username,
                        usericon: doc.usericon,
                    });
                } else {
                    console.log(`${data.username} failed login`);
                    socket.emit('login', { success: false });
                }
            }).catch(err => {
                console.log(`Error: DB login for ${data.username}`);
                socket.emit('login', { success: false });
            });
    });

    socket.on('register', data => {
        let response = {
            success: true,
            user: data.username,
            usericon: 'fa-camera',
        };
        socket.emit('register', response);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});