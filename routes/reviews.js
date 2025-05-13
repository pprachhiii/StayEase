const express = require("express");
const router = express.Router({ mergeParams: true }); // Important for accessing :id from parent
const wrapAsync = require("../utils/wrapAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/auth");
const { createReview, deleteReview } = require("../controllers/review");

// Create a review
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete a review
router.delete("/:reviewId", isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
