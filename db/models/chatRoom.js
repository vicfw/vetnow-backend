const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "نام چت روم نمیتواند خالی بماند"],
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
