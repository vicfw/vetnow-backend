const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام محصول نمیتواند خالی بماند"],
      trim: true,
      unique: true,
    },
    descreption: {
      type: String,
      required: [true, "توضیحات محصول نمیتواند خالی بماند"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "دسته بندی محصول نمیتواند خالی بماند"],
    },
    price: { type: Number, required: [true, "قیمت محصول نمیتواند خالی بماند"] },
    images: [String],
    quantity: {
      type: Number,
      default: 0,
      required: [true, "تعداد محصول نمیتواند خالی بماند"],
    },
  },
  { toJSON: { virtuals: true }, timestamps: true },
);

// Virtual populate
productSchema.virtual("comment", {
  ref: "Comment",
  foreignField: "product",
  localField: "_id",
});

module.exports = mongoose.model("Product", productSchema);
