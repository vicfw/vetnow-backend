const Cart = require("../db/models/Cart");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
function runOnce(index, res) {
  while (index === 0) {
    return res.status(200).json({ status: "success" });
  }
}

exports.addItemToCart = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const findCartForUser = await Cart.findOne({ user });
  if (findCartForUser) {
    req.body.cartItems.forEach(async (cartItem, index) => {
      const product = cartItem.product;

      const isItemAdd = findCartForUser.cartItems.some(c => {
        return c.product == product;
      });

      if (!isItemAdd) {
        await Cart.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              cartItems: cartItem,
            },
          },
        );
        runOnce(index, res);
      } else {
        await Cart.findOneAndUpdate(
          {
            user: req.user._id,
            "cartItems.product": product,
          },
          {
            $set: {
              "cartItems.$": cartItem,
            },
          },
        );
        runOnce(index, res);
      }
    });
  } else {
    const newcart = await Cart.create({
      user: req.user._id,
      cartItems: req.body.cartItems,
    });
    return res.status(200).send(newcart);
  }
});

exports.getCart = catchAsync(async (req, res, next) => {
  if (req.user) {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "cartItems.product",
      select: "name images price",
    });

    if (cart) {
      res.json({ status: "success", cart });
    }
  }

  return new AppError("You are not logged in !", 400);
});

exports.removeCart = factory.deleteOne(Cart);
