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

let messages = {};
let roundCounter = {};
let finishCounter = {};

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
                    roomOwner: user,
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
    console.log('Connected');

    socket.on('create-room', data => {
        generateRandomCode(socket, data.user);
    });

    socket.on("joined-game", data => {
        console.log(data.name);
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
                                previousBook1: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
                                previousBook2: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
                                previousBook3: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
                                savedBook1: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
                                savedBook2: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
                                savedBook3: [{ imageOwner: "owner", imageURL: "url", word: "N/A" }],
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
        socket.join(data.code);
        if (!(data.code in messages)) {
            messages[data.code] = [];
        }
        socket.emit('chat-messages', { messages: messages[data.code] });
    });

    socket.on('chat-message', data => {
        messages[data.code].push({
            time: getTimestamp(),
            user: data.user,
            message: data.message,
        });
        io.to(data.code).emit('chat-messages', { messages: messages[data.code] });
    });

    socket.on('settings', data => {
        let response = {
            numPlayers: data.numPlayers,
            timeLimit: data.timeLimit,
            gameCode: data.gameCode,
        };
        socket.emit('settings', response);
    });

    socket.on('roomJoined', roomCode => {
        socket.join(roomCode);
    });

    socket.on('startGame', roomCode => {
        io.to(roomCode).emit('gameStarted');
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    /* Gamescreen */
    socket.on("gameConnect", data => {
        socket.join(data.roomCode);
        if (!(data.roomCode in roundCounter)) {
            roundCounter[data.roomCode] = 0;
            finishCounter[data.roomCode] = 0;
        }
    });

    socket.on("loadGame", function (data) {
        let pickWordTimer = 10; // in seconds
        let drawTime = data.drawLimit;

        // let drawTime = 2;
        console.log('Loaded stats: ', data);

        io.to(data.roomCode).emit("pickaword");
        /* Function to set the time */
        setTimer(pickWordTimer, "pick", data.roomCode);

        /* Here is where we get the round time */
        setTimeout(() => {
            setTimer(drawTime, "draw", data.roomCode);
        }, (pickWordTimer + 1) * 1000);
    });

    socket.on("roundChange", async data => {
        finishCounter[data.gameRoomCode]++;
        if (finishCounter[data.gameRoomCode] === data.bookOwners.length) {
            finishCounter[data.gameRoomCode] = 0;
            roundCounter[data.gameRoomCode]++;
            console.log('Round number', roundCounter[data.gameRoomCode]);
            let urls = {};
            for (let i = 0; i < data.bookOwners.length; i++) {
                let idx = (i + roundCounter[data.gameRoomCode]) % data.bookOwners.length;
                let owner = data.bookOwners[idx];
                console.log('Looking for', owner, idx);
                let url = await getLatestImage(owner);
                urls[data.bookOwners[i]] = [url, owner];
            }
            let drawLimit = data.drawLimit;

            let timeToWait = 10;
            setTimer(timeToWait, "viewPicture", data.gameRoomCode);

            io.to(data.gameRoomCode).emit("changedRound", urls);

            let timeToGuess = 15;
            setTimeout(() => {
                console.log("guess timer");
                setTimer(timeToGuess, "guess", data.gameRoomCode);
                io.to(data.gameRoomCode).emit("hidepicture");
            }, (timeToWait + 1) * 1000);

            

            setTimeout(() => {
                console.log("draw timer");
                setTimer(drawLimit, "drawyourguess", data.gameRoomCode);

            }, (timeToGuess + timeToWait + 1) * 1000);
            

        }
    });

    function setTimer(time, timertype, roomCode) {
        var refresh = setInterval(function () {
            if (time === 0) {
                if (timertype === "pick") {
                    io.to(roomCode).emit("updateTimer", "DRAW!");
                } else if (timertype === "viewPicture") {
                    io.to(roomCode).emit("updateTimer", "GUESS");
                    io.to(roomCode).emit("hidepicture");
                } else if (timertype === "guess") {
                    io.to(roomCode).emit("updateTimer", "DRAW AGAIN");
                } else {
                    io.to(roomCode).emit("updateTimer", "Time's up");
                }
                clearInterval(refresh);
            } else {
                io.to(roomCode).emit('updateTimer', time);
                time -= 1;
            }
        }, 1000);
    }

    socket.on("wordChosen", data => {
        let user = data.user;
        console.log(`${user} chose a word`);
    });

    // Given a book owner, this function will return a url of the latest image uploaded to that book
    async function getLatestImage(bookOwner) {
        let docID = await getDocID(bookOwner);
        let playerRef = db.collection("players").doc(docID);
        let docData = await playerRef.get();
        let data = docData.data();
        let latestURL = data.previousBook1[data.previousBook1.length - 1].imageURL;
        return latestURL;
    }

    async function getDocID(username1) {
        let query = db.collection("players").where("username", "==", username1);
        let snapShot = await query.get();
        let docID = snapShot.docs[0].id;
        return docID;
    }
});