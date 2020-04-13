window.onload = async() => {

  let timeLimit = await getTimeLimit();
  setTimeLimit(timeLimit);
  let playerList = await getPlayersInRoom();
  setPlayerList(playerList);
  let dbWordList = await getWordList();
  setWordList(dbWordList);
  new Vue({ el: '#app' })

} 
  
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

async function setWordList(dbWordList) {
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
    
  let wordList = new Vue({
    el: "#wordList",
    props: dbWordList,
    data: {
      threeRandom
    }
  })
}

