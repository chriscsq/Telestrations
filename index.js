const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const admin = require('firebase-admin');
const serviceAccount = require('./telestrations.json');
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
                console.log(`Error: DB login for ${data.username}, ${err}`);
                socket.emit('login', { success: false });
            });
    });

    socket.on('register', data => {
        let players = db.collection('players');
        players.where('email', '==', data.email)
            .get().then(querySnapshot => {
                if (querySnapshot.size === 0) {
                    players.where('username', '==', data.username)
                        .get().then(nameQuery => {
                            let toAdd = {
                                username: data.username,
                                usericon: 'fa-crow',
                                email: data.email,
                                password: data.password,
                                nextNum: 1,
                            };
                            if (nameQuery.size === 1) {
                                let doc = nameQuery.docs[0].data();
                                toAdd.nextNum = doc.nextNum + 1;
                                toAdd.username = `${toAdd.username}#${doc.nextNum}`;
                            }
                            players.add(toAdd).then(docRef => {
                                console.log(`User registered as ${docRef.id}`);
                                socket.emit('register', {
                                    success: true,
                                    user: toAdd.username,
                                    usericon: toAdd.usericon,
                                });
                            }).catch(err => {
                                console.log(`Error: DB register add failed, ${err}`);
                                socket.emit('register', { success: false });
                            });
                        }).catch(err => {
                            console.log(`Error: DB inner name for ${data.username}, ${err}`);
                            socket.emit('register', { success: false });
                        });
                } else {
                    console.log(`${data.email} failed sign-up, duplicate email`);
                    socket.emit('register', { success: false });
                }
            }).catch(err => {
                console.log(`Error: DB register for ${data.email}, ${err}`);
                socket.emit('register', { success: false });
            });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});