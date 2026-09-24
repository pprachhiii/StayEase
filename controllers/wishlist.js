const Wishlist = require("../models/wishlist");

// Add property to wishlist
exports.addWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const propertyId = req.params.propertyId;

    const existing = await Wishlist.findOne({
      user: userId,
      property: propertyId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already saved",
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// Remove property
exports.removeWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const propertyId = req.params.propertyId;

    await Wishlist.findOneAndDelete({
      user: userId,
      property: propertyId,
    });

    res.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    next(error);
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    }).populate("property");

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};
