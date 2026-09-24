const Property = require("../models/property");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Property.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Cannot find listing to review.");
    return res.redirect("/properties");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;

  await review.save();
  listing.reviewItems = listing.reviewItems || [];
  listing.reviewItems.push(review._id);
  listing.reviews = listing.reviewItems.length;
  const ratings = await Review.find({ _id: { $in: listing.reviewItems } })
    .select("rating")
    .lean();
  listing.rating = ratings.length
    ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
    : 0;
  await listing.save();

  req.flash("success", "Review Added Successfully!");
  res.redirect(`/properties/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Property.findById(id);

  if (!listing) {
    req.flash("error", "Cannot find listing to delete review from.");
    return res.redirect("/properties");
  }

  await Review.findByIdAndDelete(reviewId);

  listing.reviewItems = (listing.reviewItems || []).filter(
    (item) => item.toString() !== reviewId,
  );
  listing.reviews = listing.reviewItems.length;
  const ratings = await Review.find({ _id: { $in: listing.reviewItems } })
    .select("rating")
    .lean();
  listing.rating = ratings.length
    ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
    : 0;
  await listing.save();

  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/properties/${id}`);
};
