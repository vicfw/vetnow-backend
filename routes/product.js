const express = require("express");

const {
  resizeTourImages,
  createProductHandler,
  uploadTourImages,
  updateProductHandler,
  deleteProductHandler,
  getAllProducts,
  getSingleProduct,
} = require("../controller/products.controller");
const protect = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, uploadTourImages, resizeTourImages, createProductHandler);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(protect, uploadTourImages, resizeTourImages, updateProductHandler)
  .delete(protect, deleteProductHandler);

module.exports = router;
