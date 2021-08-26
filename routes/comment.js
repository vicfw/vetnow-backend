const express = require("express");
const {
  createCommentHandler,
  getNotApprovedComments,
  updateCommentHandler,
  deleteCommentHandler,
} = require("../controller/comment.controller");
const router = express.Router();

router.route("/").post(createCommentHandler);
router.route("/:id").patch(updateCommentHandler).delete(deleteCommentHandler);
router.get("/approved", getNotApprovedComments);

module.exports = router;
