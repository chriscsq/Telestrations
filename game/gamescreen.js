window.onload = () => {
  new Vue({ el: '#app' })
}

let userlist = new Vue({
  el: "#userlist",
  data: {
    items: [
      { name: "Chris" },
      { name: "Gary" },
      { name: "Hassan" },
      { name: "Inderpreet" },
      { name: "David" },
      { name: "Chintav" },
      { name: "Traitor" }
    ]
  }
})

let timer = new Vue({
  el: "#timer",
  data: function () {
    return {
      time: 100
    }
  }
})