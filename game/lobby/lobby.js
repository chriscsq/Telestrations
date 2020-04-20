let gameSettings = new Vue({
  el: "#game-settings",
  data: {
    isRoomOwner: false,
    players: [
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ],
    times: [
      { id: 30 },
      { id: 40 },
      { id: 50 },
      { id: 60 },
      { id: 70 },
      { id: 80 },
      { id: 90 },
      { id: 100 },
    ],
  },
  methods: {
    changeNumPlayers: function (event) {
      this.selectedPlayers = event.target.options[event.target.options.selectedIndex].text
    },
    changeTime: function (event) {
      this.selectedTime = event.target.options[event.target.options.selectedIndex].text
    },
  },
});

let roomCode = Cookies.get("roomCode");

getRoomOwner(roomCode).then(roomOwner => {
  gameSettings.isRoomOwner = Cookies.get('username') === roomOwner;
  Cookies.set('isLeader', gameSettings.isRoomOwner);
})

var socket_io = io();
document.getElementById("game-code").innerHTML += roomCode;



let updateIcons = async players => {
  $("#player_icons").empty();
  let icons = await getUserIcons(players);
  console.log(icons);
  for (let i = 0; i < icons.length; i++) {
    let iconMap = icons[i];
    let name = iconMap.name;
    let icon = iconMap.usericon;
    $("#player_icons").append(`<b>${name}</b>&nbsp&nbsp<i class='${icon} avatar-size'></i><br>`);
  }
};

setPlayerSnapshot(roomCode, async doc => {
  let data = doc.data();
  await updateIcons(data.players);
});

socket_io.on('connect', () => {
  socket_io.emit('roomJoined', roomCode);
});

socket_io.on('gameStarted', () => {
  $("#game-settings").submit();
});

function validateForm() {
  var numPlayers = parseInt($("#player-dropdown :selected").val());
  var timeLimit = parseInt($("#time-dropdown :selected").val());
  if (numPlayers === "Number of players") {
    alert("Please select the room limit");
    if (timeLimit === "Seconds") {
      alert("Please select a time limit");
    }
  } else if (timeLimit === "Seconds") {
    alert("Please select a time limit");
    if (numPlayers === "Number of players") {
      alert("Please select the room limit");
    }
  } else {
    Promise.all([
      updateTimeLimit(roomCode, timeLimit),
      updateRoomLimit(roomCode, numPlayers),
    ]).then(() => {
      socket_io.emit('startGame', roomCode);
    });
  }
}