const express = require("express");

const router = express.Router();

const {
  addWishlist,
  removeWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, getWishlist);

router.post("/:propertyId", isAuthenticated, addWishlist);

router.delete("/:propertyId", isAuthenticated, removeWishlist);

module.exports = router;
