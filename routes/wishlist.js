const express = require("express");

const router = express.Router();

const {
  addWishlist,
  removeWishlist,
  getWishlist,
} = require("../controllers/wishlist");

const { isLoggedIn } = require("../middleware/auth");

router.post("/:propertyId", isLoggedIn, addWishlist);
router.delete("/:propertyId", isLoggedIn, removeWishlist);
router.get("/", isLoggedIn, getWishlist);
module.exports = router;
