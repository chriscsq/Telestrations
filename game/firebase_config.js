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
    return threeRandom;
}

async function getRoomLimit(roomCode) {
    var roomLimit;
    let query = db.collection("game-rooms");
    try {
        var allRoomsSnapShot = await query.get();
        allRoomsSnapShot.forEach(doc => {
            if (doc.data().roomCode == roomCode) {
                roomLimit = doc.data().roomLimit;
            }
        })
    } catch (err) {
        console.log("Error getting document", err);
    }
    return roomLimit;
}

async function sendImgToFirebase(image){

    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imagesRef = storageRef.child('images/'+ 'canvas' + new Date().getTime());
    var file = image;
    //string of current user would be passed in as owner here
    var username = Cookies.get('username')
    var chosenWord = document.getElementById("selectedWord").innerHTML
    var metadata = {
        customMetadata: {
          'owner': username,
          'activity': 'drawing',
          'word': chosenWord
        }
      }
    imagesRef.put(file, metadata).then(function(snapshot) {
        console.log('blob uploaded to firebase.');
    })
}

async function getUserIcons(playerList) {
    var iconList = Array();
    var iconMap;
    let query = db.collection("players");
    try {
        var allPlayerSnapShot = await query.get();
        playerList.then(function (players) {
            for(var i = 0; i < players.length; i++) {
                allPlayerSnapShot.forEach(doc => {
                    if (doc.data().username == players[i]) {
                        iconMap = Object();
                        var icon = doc.data().usericon;
                        iconMap.name = players[i];
                        iconMap.icon = icon;
                        iconList.push(iconMap);
                    }
                })
            }
        }) 
    } catch (err) {
        console.log("Error getting user icon", err)
    }
    return iconList;
}


// Parameters : pick is either 0 or 1 (user customization or avatar customization)
//              info1 is either username color or avatar depending on pick
//              info2 is either banner color or avatar color depending on pick
async function updateUserData (pick, info1, info2) {
    let docID = '';

    let query = db.collection("players").where("username", "==", Cookies.get('username'));
    try {
        var snapShot = await query.get();
        docID = snapShot.docs[0].id;
        
    } catch (err) {
        console.log("Error getting document ID", err);
    }

    var playerRef = db.collection("players").doc(docID);

    try {
        if(pick === 0) {
            playerRef.update({
                usernameColor : info1,
                bannerColor : info2
            })
        } else {
            playerRef.update({
                usericon : info1,
                iconColor : info2
            })
        }     
    } catch (err) {
        console.log("Error updating document", err);
    }
}