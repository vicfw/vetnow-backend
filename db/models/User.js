const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  phone: {
    type: String,
    required: [true, "شماره موبایل خود را وارد کنید"],
    validate: {
      validator: function (v) {
        return /09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/.test(v);
      },
      message: props => `لطفا یک شماره تلفن همراه معتبر وارد نمایید`,
    },
    minLength: [11, "شماره موبایل باید 11 رقم باشد"],
    maxLength: [11, "شماره موبایل باید 11 رقم باشد"],
    trim: true,
    unique: true,
  },
  password: {
    type: Number,
    required: [true, "رمز عبور خود را وارد نمایید"],
    min: [5, "رمز عبور نادرست است"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
