const multer = require("multer");
const sharp = require("sharp");
const Product = require("../db/models/Product");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.array("images");

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});


exports.createProductHandler = factory.createOne(Product);

exports.updateProductHandler = factory.updateOne(Product);

exports.deleteProductHandler = factory.deleteOne(Product);

exports.getAllProducts = factory.getAll(Product);

exports.getSingleProduct = factory.getOne(Product, { path: "comment" });


