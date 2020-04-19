let vueMain;

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
        return this.playerList = await getPlayersInRoom("GCWD");
      },
      async getTimeLimit() {
        return this.timers = await getTimeLimit("GCWD");
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
  props: ['value']

})

Vue.component("playerlist", {
  template: "#player-list",
  props: ['name']

})

let socket = io();

socket.on("connect", () => {
  console.log("connected here");
});

socket.on("pickaword", function () {
  document.getElementById("startgame").style.display = 'none';
  document.getElementById("overlay").style.display = "block";
});

socket.on("updateTimer", function (data) {
  if (data === "DRAW!") {
    console.log('Start drawing');
    document.getElementById("waitOverlay").style.display = "none";
  }
  document.getElementById("timer").innerHTML = data;
});

// start game called on click
async function startGame() {
  //Socket connects to the namespace of the gameroom
  document.getElementById("startgame").style.display = 'none';
  var roomCode = Cookies.get(roomCode);
  //let socket = io('/'+ roomCode);
  console.log('start game pressed');

  let rounds = await getRoomLimit("GCWD");
  let drawLimit = await getTimeLimit("GCWD");

  Promise.all([rounds, drawLimit]).then(() => {
    let roomInfo = {
      rounds,
      drawLimit,
    };
    socket.emit('loadGame', roomInfo);
  });

  // var rounds = await getRoomLimit("GCWD");
  // console.log('Rounds after promise', rounds);
  // var drawLimit = await getTimeLimit("GCWD");
  // console.log('Draw limit after promise', drawLimit[0]);

  // let roomInfo = {};
  // let setObj = async function (maxRounds, drawTime) {
  //   roomInfo.maxRounds = maxRounds;
  //   roomInfo.drawTime = drawTime;
  // }
}

async function getAsyncRoomLimit(roomCode) {
  return await getRoomLimit();
}

let assignWord = () => {
  document.getElementById("selectedWord").innerHTML = vueMain.wordList[0].trim();
}

  //pickTimer();
/*
while (game_over != true) {

  if (round == roundLimit) {
      game_over = true;
  }
  pickWord(round);

  console.log(round);
    //pickWord();

  /* have people pick a word for 15 seconds */

/* draw for 50 seconds */

/* guess for 30 seconds */

