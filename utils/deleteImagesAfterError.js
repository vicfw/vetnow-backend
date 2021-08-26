const fs = require("fs");

const deleteImagesAfterError = async (Model, _id) => {
  const { images } = await Model.findById({ _id });
  if (images) {
    images.forEach(img => {
      fs.unlink(`public/img/products/${img}`, err => {});
    });
  }
};
module.exports = deleteImagesAfterError;
