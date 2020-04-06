var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const socketEvents = require('./socket-events')

app.use("/js", express.static(__dirname + "/game/js"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/game/gamescreen.html");
});

io.on("connection", function(socket) {
  // at this point a client has connected
  socket.on(socketEvents.DRAW, function(data) {
    socket.broadcast.emit(socketEvents.DRAW, data);
  });

  socket.on(socketEvents.DRAW_BEGIN_PATH, function() {
    socket.broadcast.emit(socketEvents.DRAW_BEGIN_PATH);
  });
});

http.listen(8080, function() {
  console.log("Listening on port 8080");
});