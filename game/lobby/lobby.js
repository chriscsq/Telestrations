let players = new Vue({
  el: '#players',
  data: {
    players: [
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
    ],
  },
  methods: {
    changeNumPlayers: function (event) {
      this.selectedPlayers = event.target.options[event.target.options.selectedIndex].text
    },
  },
});

let drawTime = new Vue({
  el: "#draw-time",
  data: {
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
    changeTime: function (event) {
      this.selectedTime = event.target.options[event.target.options.selectedIndex].text
    },
  },
});

var socket_io = io();
var roomCode = Cookies.get("roomCode");
document.getElementById("game-code").innerHTML += roomCode;

var playerPromise = getPlayersInRoom(roomCode);
var playerList = Promise.resolve(playerPromise);
var playerIconPromise = getUserIcons(playerList)
var iconList = Promise.resolve(playerIconPromise);

playerList.then(function (players) {
  for (var i = 0; i < players.length; i++) {
    $("#room_players").append(`<b>${players[i]}</b> &nbsp &nbsp`);
  }
  $("#room_players").append("<br>");
})

iconList.then(function (icons) {
  for (var i = 0; i < icons.length; i++) {
    var iconObject = icons[i];
    var iconMap = Object.values(iconObject);
    var icon = iconMap[1];
    $("#player_icons").append(`<i class='${icon} avatar-size'></i>&nbsp &nbsp`);
  }
})

function validateForm() {
  var numPlayers = $("#player-dropdown :selected").val();
  var timeLimit = $("#time-dropdown :selected").val();
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
      $("#game-settings").submit();
    });
  }
}