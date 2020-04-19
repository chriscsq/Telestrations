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
})

var socket_io = io();
document.getElementById("game-code").innerHTML += roomCode;

let updatePlayers = players => {
  $("#room_players").empty();
  for (var i = 0; i < players.length; i++) {
    $("#room_players").append(`<b>${players[i]}</b> &nbsp &nbsp`);
  }
  $("#room_players").append("<br>");
};

let updateIcons = async players => {
  $("#player_icons").empty();
  let icons = await getUserIcons(players);
  for (let i = 0; i < icons.length; i++) {
    $("#player_icons").append(`<i class='${icons[i]} avatar-size'></i>&nbsp &nbsp`);
  }
};

setPlayerSnapshot(roomCode, async doc => {
  let data = doc.data();
  updatePlayers(data.players);
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