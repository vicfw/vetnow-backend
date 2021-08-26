const Chatroom = require("../db/models/chatRoom");
const catchAsync = require("../utils/catchAsync");

exports.chatroomHandler = catchAsync(async (req, res, next) => {
  await Chatroom.create(req.body);

  res
    .status(201)
    .json({ status: "success", message: "چت روم با موفقیت ایجاد شد." });
});

exports.getRoomForADoctor = catchAsync(async (req, res) => {
  const rooms = await Chatroom.find({});
  if (!rooms) {
    res
      .status(404)
      .json({ status: "fail", message: "اتاقی برای این کاربر یافت نشد" });
  }
  res.status(200).json({ status: "success", data: rooms });
});
