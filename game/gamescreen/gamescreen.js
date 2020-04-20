let vueMain;
let gameRoomCode = Cookies.get('roomCode');
let isLeader = Cookies.get('isLeader') === "true";
let socket = io();

Cookies.set('currentOwner', Cookies.get('username'));

window.onload = async () => {
  vueMain = new Vue({
    el: '#app',
    data: {
      playerList: [''],
      timers: [''],
      wordList: ['']
    },
    mounted() {
      this.getPlayerList();
      this.getTimeLimit();
      this.getWordList();
    },
    methods: {

      async getPlayerList() {
        return this.playerList = await getPlayersInRoom(gameRoomCode);
      },
      async getTimeLimit() {
        return this.timers = await getTimeLimit(gameRoomCode);
      },
      async getWordList() {
        return this.wordList = await getWordList();
      },
    }
  })

  //startGame();
}

Vue.component("timercomponent", {
  template: "#timer-component",
  props: ['value'],
});

Vue.component("playerlist", {
  template: "#player-list",
  props: ['name'],
});

let startButton = new Vue({
  el: "#startgame",
  data: {
    isLeader: false,
  },
});
startButton.isLeader = isLeader;

let pickedWord = false;

let assignWord = (word = vueMain.wordList[0].trim()) => {
  document.getElementById("selectedWord").innerHTML = word;
  socket.emit('wordChosen', { user: Cookies.get('username') });
  pickedWord = true;
  document.getElementById("overlay").style.display = "none";
  Cookies.set('chosenWord', word);
}

socket.on("changedRound", data => {
  console.log('Changed round', data);
  Cookies.set('currentOwner', data[Cookies.get('username')][1]);
  let myImage = data[Cookies.get('username')][0];
  document.getElementById('chosenImage').src = myImage;
  document.getElementById('myCanvas').style.display = 'none'
  document.getElementById('chosenImage').style.display = 'block'
  document.getElementById('selectedWordWrapper').innerHTML = 'Study the image! you will only get a few seconds to view it!'
});


socket.on("hidepicture", message => {
  document.getElementById('myCanvas').style.display = 'block'
  document.getElementById('chosenImage').style.display = 'none'
  if (message) {
    document.getElementById('selectedWordWrapper').innerHTML = message;
  }
});

socket.on("connect", () => {
  setPreviousBooks();
  socket.emit('gameConnect', { roomCode: gameRoomCode });
});

async function changeRound() {
  console.log('Round done');
  let bookOwners = await getPlayersInRoom(gameRoomCode);
  let drawLimit = await getTimeLimit(gameRoomCode);
  socket.emit("roundChange", { gameRoomCode, bookOwners, drawLimit });
};

socket.on("pickaword", function () {
  document.getElementById("overlay").style.display = "block";
});

socket.on("updateTimer", function (data) {
  if (data === "DRAW!") {
    if (!pickedWord) {
      assignWord();
    }
    console.log('Start drawing');
    document.getElementById("waitOverlay").style.display = "none";
  }
  document.getElementById("timer").innerHTML = data;
});

socket.on("gameOver", () => {
  console.log('Done game');
  window.location.href = '../index.html';
});

// start game called on click
async function startGame() {
  //Socket connects to the namespace of the gameroom
  document.getElementById("startgame").style.display = 'none';
  console.log('start game pressed');

  let rounds = await getRoomLimit(gameRoomCode);
  let drawLimit = await getTimeLimit(gameRoomCode);

  Promise.all([rounds, drawLimit]).then(() => {
    let roomInfo = {
      rounds,
      drawLimit,
      roomCode: gameRoomCode,
    };
    socket.emit('loadGame', roomInfo);
  });

}
