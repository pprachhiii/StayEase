const express = require("express");

const {
  getProperties,
  toggleWishlist,
  getWishlist,
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/", getProperties);

router.get("/wishlist", getWishlist);

router.post("/:propertyId/wishlist", toggleWishlist);

module.exports = router;
