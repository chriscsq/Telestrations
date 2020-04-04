window.onload = () => {
  new Vue({ el: '#app' })
}

var userlist = new Vue({
  el: "#userlist",
  data: {
    items: [
      {name: "Chris"},
      {name: "Gary" },
      {name: "Hassan"},
      {name: "Inderpreet"},
      {name: "David"},
      {name: "Chintav"},
      {name: "Traitor"}
    ]
  }
})

var timer = new Vue({
  el: "#timer",
  data: function() {
    return {
      time: 100
    }
  }
})