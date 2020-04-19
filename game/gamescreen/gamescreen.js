
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
        console.log("wordList " + await getWordList());
        return this.wordList = await getWordList();
      },
      async startGame() {
        /* replace param with Cookies.get(roomCode) after testing */
        let timers = await getTimeLimit("GCWD");
        setInterval(function() {
          if (timers <= 0) {
            clearInterval(timers);
            document.getElementById("timer").innerHTML = "Time's up";
          } else {
            document.getElementById("timer").innerHTML = timers;
          }
          timers -= 1;
        }, 1000);
        console.log("game started" + timers);
      }
      
    }
  })

} 

Vue.component("timercomponent", {
  template: "#timer-component",
  props: ['value']
  
})

Vue.component("playerlist", {
  template: "#player-list",
  props: ['name']

})


