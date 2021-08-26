const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "نام چت روم نمیتواند خالی بماند"],
    ref: "Chatroom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: [true, "پیام نمیتواند خالی بماند"],
  },
});

module.exports = mongoose.model("Message", chatMessageSchema);
