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
        
    },
  },
});
