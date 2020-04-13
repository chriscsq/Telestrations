window.onload = async() => {

  let timeLimit = await getTimeLimit();
  setTimeLimit(timeLimit);
  let playerList = await getPlayersInRoom();
  setPlayerList(playerList);
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

