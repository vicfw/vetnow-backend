const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    body: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

commentSchema.virtual("child", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

module.exports = mongoose.model("Comment", commentSchema);
