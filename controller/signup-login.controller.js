const User = require("../db/models/User");
const catchAsync = require("../utils/catchAsync");
const signToken = require("../utils/createJwtToken");
const smsSender = require("../utils/smsSender");

exports.isUserLoggedIn = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select("-__v");
  if (user) {
    res.status(200).json({ result: "success", user });
  }
});

exports.signupLoginHandler = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  let phone;
  if (req.query.phone) {
    phone = req.query.phone;
  } else {
    phone = req.body.phone;
  }
  const password = Math.floor(Math.random() * 10000) + 10000;

  // update password if user already exist
  const oldUser = await User.findOne({ phone });

  if (oldUser) {
    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { password },
      { new: true, runValidators: true },
    ).select("-__v");
    //send sms
    await smsSender(phone, password);
    return res.status(200).json({
      status: "success",
      user: updatedUser,
      message: "User Updated.",
    });
  }
  //create new user
  const newUser = await User.create({ phone, password, role: "user" });
  if (newUser) {
    //send sms
    await smsSender(phone, password);

    res.status(201).json({
      status: "success",
      user: newUser,
      message: "User Created Successfully.",
    });
  }
});

//login-confirm
exports.loginConfirmHandler = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { phone } = req.params;

  const user = await User.findOne({ password, phone }).select("-__v");
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "رمز عبور صحیح نمی باشد",
    });
  }
  const token = signToken(phone);
  res.cookie("jwt", token, { httpOnly: true });

  res.status(200).json({
    status: "success",
    data: { token, user },
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("شما اجازه دسترسی به این قسمت را ندارید", 403));
    }

    next();
  };
};
