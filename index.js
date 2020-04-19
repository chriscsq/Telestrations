const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const admin = require('firebase-admin');
const serviceAccount = require('./game/telestrations.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telestrations-45c76.firebaseio.com'
});
const db = admin.firestore();

app.use(express.static('game/', { extensions: ['html'] }));

let messages = {}

server.listen(80, () => {
    console.log('Game server started on port 80');
});

let getTimestamp = () => {
    let date = new Date();
    let minutes = date.getMinutes();
    if (minutes <= 9) {
        minutes = `0${minutes}`;
    }
    let time = `:${minutes}`;
    let hour = date.getHours();
    if (hour > 12) {
        time = `${hour - 12}${time}PM`;
    } else if (hour == 0) {
        time = `${hour + 12}${time}AM`;
    } else if (hour == 12) {
        time = `${hour}${time}PM`;
    } else {
        time = `${hour}${time}AM`;
    }
    return time;
}

let generateRandomCode = (socket, user) => {
    let randomCode = '';
    for (let i = 0; i < 4; i++) {
        randomCode += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }

    db.collection('game-rooms')
        .where('roomCode', '==', randomCode)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.size === 0) {
                let toAdd = {
                    players: [user],
                    roomCode: randomCode,
                    roomLimit: 5,
                    timeLimit: 60,
                };
                db.collection('game-rooms').doc(randomCode).set(toAdd).then(() => {
                    console.log(`Room created as ${randomCode}`);
                    socket.emit('create-room', { code: randomCode });
                }).catch(err => {
                    console.log(`Error: DB room can't be created, ${err}`);
                });
            } else {
                console.log(`Error: DB room ${randomCode} duplicate during creation`);
                generateRandomCode(socket, user);
            }
        }).catch(err => {
            console.log(`Error: Room find failed, ${err}`);
        });
}

io.on('connect', socket => {
    console.log('Client connected');

    socket.on('create-room', data => {
        generateRandomCode(socket, data.user);
    });

    socket.on('join-room', data => {
        let rooms = db.collection('game-rooms');
        rooms.where('roomCode', '==', data.code)
            .get().then(querySnapshot => {
                if (querySnapshot.size === 1) {
                    let ref = querySnapshot.docs[0].ref;
                    ref.update({
                        players: admin.firestore.FieldValue.arrayUnion(data.user),
                    }).then(() => {
                        let response = {
                            success: true,
                            code: data.code,
                        };
                        socket.emit('join-room', response);
                    }).catch(err => {
                        console.log(`Error: DB error adding user to room, ${err}`);
                    });
                } else {
                    socket.emit('join-room', { success: false });
                }
            }).catch(err => {
                console.log(`Error: DB join query failed, ${err}`);
            });
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
                        username: doc.username,
                        usericon: doc.usericon,
                        iconColor: doc.iconColor,
                        bannerColor: doc.bannerColor,
                        usernameColor: doc.usernameColor,
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
                                usericon: 'fas fa-crow',
                                email: data.email,
                                password: data.password,
                                nextNum: 1,
                                iconColor: '#5A5ACA',
                                bannerColor: '#5ACA5A',
                                usernameColor: '#CA5A5A',
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
                                    username: toAdd.username,
                                    usericon: toAdd.usericon,
                                    iconColor: toAdd.iconColor,
                                    bannerColor: toAdd.bannerColor,
                                    usernameColor: toAdd.usernameColor,
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

    socket.on('chat-connect', data => {
        socket.join(data.roomCode);
        if (!(data.roomCode in messages)) {
            messages[data.roomCode] = [];
        }
        socket.emit('chat-messages', { messages: messages[data.roomCode] });
    });

    socket.on('chat-message', data => {
        messages[data.roomCode].push({
            time: getTimestamp(),
            user: data.user,
            message: data.message,
        });
        io.to(data.roomCode).emit('chat-messages', { messages: messages[data.roomCode] });
    });
    socket.on('settings', data => {
        let response = {
            numPlayers: data.numPlayers,
            timeLimit: data.timeLimit,
            gameCode: data.gameCode,
        };
        socket.emit('settings', response);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
