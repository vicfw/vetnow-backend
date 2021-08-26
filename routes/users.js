const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  signupLoginHandler,
  loginConfirmHandler,
  isUserLoggedIn,
} = require("../controller/signup-login.controller");
const { getAllDoctorsHandler } = require("../controller/user.controller");

router.get("/", protect, isUserLoggedIn);
router.post("/signup-login", signupLoginHandler);
router.post("/login-confirm/:phone", loginConfirmHandler);
// getting users route
router.get("/doctors", protect, getAllDoctorsHandler);

module.exports = router;
