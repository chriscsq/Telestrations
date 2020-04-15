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
const storage = firebase.storage();


async function getTimeLimit(roomCode) {
    var timeLimit;
    let query = db.collection("game-rooms");
    try {
        var allRoomsSnapShot = await query.get();
        allRoomsSnapShot.forEach(doc => {
            if (doc.data().roomCode == roomCode) {
                timeLimit = doc.data().timeLimit;
                console.log(doc.data().timeLimit);
            }
        })
    } catch (err) {
        console.log("Error getting document", err);
    }
    return timeLimit;
}

async function getPlayersInRoom(roomCode) {
    var playerList;
    let query = db.collection("game-rooms");
    try {
        var allRoomsSnapShot = await query.get();
        allRoomsSnapShot.forEach(doc => {
            if (doc.data().roomCode == roomCode) {
                playerList = doc.data().players;
            }
        })
    } catch (err) {
        console.log("Error getting document", err);
    }
    return playerList;
}
//module.exports = getRoomTimer;

async function getWordList() {
    var list = db.collection("dictionary").doc("phrases")
    const snapshot = await list.get();
    var wordList = snapshot.data().phrase;
    var threeRandom = [];

    const shuffled = wordList.sort(()=> 0.5 - Math.random());
    threeRandom = shuffled.slice(0, 3);
    console.log(threeRandom)
    return threeRandom;
}

async function sendImgToFirebase(image){

    var storage = firebase.storage();
    var storageRef = storage.ref();
    var nameIncrement = 1;
    var imagesRef = storageRef.child('images/'+ 'canvas' + new Date().getTime());
    var file = image;
    //string of current user would be passed in as owner here
    var metadata = {
        customMetadata: {
          'owner': 'owner name here',
          'activity': 'drawing'
        }
      }
    imagesRef.put(file, metadata).then(function(snapshot) {
        console.log('blob uploaded to firebase.');
        nameIncrement++;
    })
}