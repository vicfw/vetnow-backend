const mongoose = require("mongoose");
const app = require("./app.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./db/models/User.js");
const Message = require("./db/models/message");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

require("dotenv").config();

let DB;

if (process.env.NODE_ENV === "production") {
  DB = process.env.MONGODB_PROD;
} else {
  DB = "mongodb://localhost:27017/joje-backend";
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const server = app.listen(process.env.PORT, () => {
  console.log("Server Is Running On " + process.env.PORT);
});

//socket.io part of server

const io = require("socket.io")(server);

io.use(async (socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token = socket.handshake.auth.token;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await User.findOne({ phone: decoded.id });
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }
    socket.user = currentUser;
    next();
  }
});
io.on("connection", socket => {
  console.log("socket conected");
  socket.on("joinroom", roomId => {
    socket.join(roomId);
  });

  socket.on("chatroomMessage", async ({ message, roomId }, callback) => {
    if (message.trim().length > 0) {
      await Message.create({
        chatroom: roomId,
        user: socket.user._id,
        message,
      });
      io.to(roomId).emit("newMessage", {
        message: {
          text: message,
          user: socket.user._id,
        },
        name: socket.user.phone,
      });
    }
    callback();
  });

  socket.on("leaveroom", roomId => {
    socket.leave(roomId);
  });
  socket.on("disconnect", () => {
    console.log("disconnect" + socket.user._id);
  });
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
