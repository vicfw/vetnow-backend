const User = require("../db/models/User");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctorsHandler = catchAsync(async (req, res) => {
  const doctors = await User.find({}).where("role").equals("doctor");
  if (!doctors) {
    return res
      .status(204)
      .json({ result: "fail", message: "دکتری وجود ندارد" });
  }

  res.status(200).json({
    result: "success",
    results: doctors.length,
    data: doctors,
  });
});
