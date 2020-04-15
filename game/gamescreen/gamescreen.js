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
        console.log(await getPlayersInRoom());
        return  this.playerList = await getPlayersInRoom();
      },
      async getTimeLimit() {
        console.log("time " + await getTimeLimit());
        return this.timers = await getTimeLimit();

      },
      async getWordList(){
        console.log("wordList " + await getWordList());
        return this.wordList = await getWordList();
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

Vue.component("wordList", {
  template: "#wordList",
  props: ['word']
})


// async function getWordList(dbWordList) {
//   const words = [];
//   let threeRandom = [];
//   for (i = 0; i < dbWordList.length; i++) {
//     words.push(dbWordList[i]);
//     console.log(dbWordList[i]);
//   }
//   //three random words
//   const shuffled = words.sort(()=> 0.5 - Math.random());
//   threeRandom = shuffled.slice(0, 3);
//   console.log(threeRandom)
//   /*
//   let wordList = new Vue({
//     el: "#wordList",
//     props: dbWordList,
//     data: {
//       threeRandom
//     }
//   })
//   */
//  return threeRandom;
// }


/*
async function setPlayerList(playerList) {
    const items = [];
    for (i = 0; i < playerList.length; i++) {
      items.push({name:playerList[i]});
    }

    let userlist = new Vue({
      el: "#userlist",
      props: playerList,
      data: {
        items
      }
    })
  
  }


async function setTimeLimit(timeLimit) {
  let timer = new Vue({
    el: "#timer",
    data: function () {
      return {
        time: timeLimit
      }
    }
  })
}
*/
