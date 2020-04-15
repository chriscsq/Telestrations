
window.onload = async() => {
  new Vue({ el: '#app', 
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
        /* replace param with Cookies.get(roomCode) after testing */
        return  this.playerList = await getPlayersInRoom("GCWD");
      },
      async getTimeLimit() {
          /* replace param with Cookies.get(roomCode) after testing */
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


/*
async function getWordList(dbWordList) {
  const words = [];
  let threeRandom = [];
  for (i = 0; i < dbWordList.length; i++) {
    words.push(dbWordList[i]);
    console.log(dbWordList[i]);
  }
  //three random words
  const shuffled = words.sort(()=> 0.5 - Math.random());
  threeRandom = shuffled.slice(0, 3);
  console.log(threeRandom)

 return threeRandom;
}
*/

