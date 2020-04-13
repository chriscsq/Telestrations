// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCriaKEnXrkPy8W7sT68dBsYvxgxDpmlME",
    authDomain: "telestrations-45c76.firebaseapp.com",
    databaseURL: "https://telestrations-45c76.firebaseio.com",
    projectId: "telestrations-45c76",
    storageBucket: "telestrations-45c76.appspot.com",
    messagingSenderId: "698250271965",
    appId: "1:698250271965:web:fa4a7cf50a8e4777cb0f34",
    measurementId: "G-4Y4XBGMKQ1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

/* Add parameter which should be room code later, change YNOV to be parameter */
async function getPlayersInRoom() {
    var room = db.collection("game-rooms").doc("YNQV");
    const snapshot = await room.get();
    let playerList = snapshot.data().players;
    return playerList;
}

/* Add parameter which should be room code later, change YNOV to be parameter */
async function getTimeLimit() {
    var room = db.collection("game-rooms").doc("YNQV");
    const snapshot = await room.get(); 
    let timeLimit = snapshot.data().timeLimit;
    return timeLimit;
}

//module.exports = getRoomTimer;