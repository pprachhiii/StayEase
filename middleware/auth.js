const Property = require("../models/property");
const Review = require("../models/review");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");

// Validation middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Review Validation middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = async (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Property.findById(id);

  if (!listing) {
    req.flash("error", "That stay no longer exists.");
    return res.redirect("/properties");
  }

  if (!listing.owner || !res.locals.currUser?._id.equals(listing.owner)) {
    req.flash("error", "Only the owner can change this stay.");
    return res.redirect(`/properties/${id}`);
  }

  res.locals.listing = listing;
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/properties/${id}`);
  }

  if (!res.locals.currUser._id.equals(review.author)) {
    req.flash("error", "Unauthorized!");
    return res.redirect(`/properties/${id}`);
  }

  next();
};

// Validation middleware
// const validateUser = (req, res, next) => {
//   let { error } = userSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };
