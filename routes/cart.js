const express = require("express");
const { addItemToCart, getCart, removeCart } = require("../controller/cart.controller");
const protect = require("../middleware/protect");
const router = express.Router();

router.route("/").post(protect, addItemToCart).get(protect, getCart);
router.route("/:id").delete(removeCart);
module.exports = router;
