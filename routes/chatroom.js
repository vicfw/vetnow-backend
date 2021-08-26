const router = require("express").Router();
const {
  chatroomHandler,
  getRoomForADoctor,
} = require("../controller/chatroom.controller");
const protect = require("../middleware/protect");

router.use(protect);
router.route("/").post(chatroomHandler).get(getRoomForADoctor);

module.exports = router;
