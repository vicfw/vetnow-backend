const Comment = require("../db/models/Comment");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createCommentHandler = factory.createOne(Comment);

exports.getNotApprovedComments = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const comment = await Comment.find({})
    .where("approved")
    .equals(false)
    .populate([
      { path: "product", select: "name" },
      { path: "user", select: "phone" },
    ])
    .skip(skip)
    .limit(limit);
  const allCommentsCount = await Comment.find({})
    .where("approved")
    .equals(false)
    .countDocuments();
  res.status(200).json({
    status: "success",
    length: comment.length,
    data: comment,
    allDocs: allCommentsCount,
    page,
  });
});

exports.updateCommentHandler = factory.updateOne(Comment);
exports.deleteCommentHandler = factory.deleteOne(Comment);
