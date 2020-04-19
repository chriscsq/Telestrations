window.onload = async() => {
  var vueMain = new Vue({ el: '#app', 
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
        return  this.playerList = await getPlayersInRoom("GCWD");
      },
      async getTimeLimit() {
        return this.timers = await getTimeLimit("GCWD");
      },
      async getWordList(){
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

// start game called on click
async function startGame() {
  //Socket connects to the namespace of the gameroom
  document.getElementById("startgame").style.display = 'none';
  var roomCode = Cookies.get(roomCode);
  //let socket = io('/'+ roomCode);
  let socket = io();
  console.log('start game pressed');


  var rounds = await console.log(Promise.resolve(getRoomLimit("GCWD")));
  var drawLimit = await getTimeLimit("GCWD");

  let roomInfo = {};
  let setObj = async function(maxRounds, drawTime) {
    roomInfo.maxRounds = maxRounds;
    roomInfo.drawTime = drawTime;
  }



  socket.on("connect", () => {
    console.log("connected here");
    socket.emit('loadGame', roomInfo);
  })

  socket.on("pickaword", function() {
    document.getElementById("overlay").style.display = "block";
  });

  socket.on("updateTimer", function(data) {
    document.getElementById("timer").innerHTML = data;
  })

}

async function getAsyncRoomLimit(roomCode) {
  return await getRoomLimit();
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
  
