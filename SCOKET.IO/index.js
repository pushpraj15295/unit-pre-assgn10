const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const history = [];

io.on("connection", (socket) => {
  console.log("new user connected");

  // when a new user joined chat and send alert to all user
  // io.emit("newuser");

  // others user will get alert whenever a new user is joined
  socket.broadcast.emit("newuser");

  // message sending from server side
  //socket.emit("new connection", "how are you ?");

  // listing from client side
  socket.on("new message", (data) => {
    history.push(data);
    io.emit("new connection", data);
  });

  socket.emit("history", history);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8080, () => {
  console.log("server started on port 8080");
});
