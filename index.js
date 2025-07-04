const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config();
const session = require("express-session")
const flash = require("connect-flash")
const http = require("http")
const { saveChatInDB } = require('./controllers/user.controller')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'longsecretkey',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}))
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", require("./routes/auth.route"));
app.use("/", require("./routes/user.route"));

let onlineUsers = {};

io.on('connection', (socket) => {
  // Jab user connect ho
  socket.on('user-connected', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('update-user-status', onlineUsers); // Sabko bata do
  });

  socket.on('join-room', ({ senderId, receiverId }) => {
    let roomId = [senderId, receiverId].sort().join("_")
    socket.join(roomId);
  })

  socket.on('private-message', ({ senderId, receiverId, message }) => {
    let roomId = [senderId, receiverId].sort().join("_")
    io.to(roomId).emit('received-message', {senderId, message });
    saveChatInDB(senderId,receiverId,message)
  });


  // Jab user disconnect ho
  socket.on('disconnect', () => {
    for (let uid in onlineUsers) {
      if (onlineUsers[uid] === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
    io.emit('update-user-status', onlineUsers); // Sabko update bhej do
  });
});


server.listen(process.env.PORT, '0.0.0.0', () => console.log(`Server is running on port ${process.env.PORT}`))