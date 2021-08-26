const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("../db/models/Product");
const deleteImagesAfterError = require("../utils/deleteImagesAfterError");

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    if (Model === Product) {
      await deleteImagesAfterError(Model, _id);
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    if (req.body.images && req.body.images.length === 0) {
      delete req.body.images;
    }
    // if (Model === Product) {
    //   await deleteImagesAfterError(Model, req.params.id);
    // }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.id) filter = { product: req.params.id };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
