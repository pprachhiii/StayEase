const Property = require("../models/Property");
const Wishlist = require("../models/Wishlist");

const getProperties = async (req, res) => {
  try {
    const {
      location,
      price,
      type,
      rating,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      instantBook,
      selfCheckIn,
      stepFreeEntrance,
      wideDoorways,
      hostStatus,
      sort,
    } = req.query;

    const filter = {};

    // LOCATION
    if (location && location.trim()) {
      filter.$or = [
        {
          "location.city": {
            $regex: location.trim(),
            $options: "i",
          },
        },
        {
          "location.country": {
            $regex: location.trim(),
            $options: "i",
          },
        },
      ];
    }

    // PRICE
    if (price !== undefined && price !== "") {
      const maxPrice = Number(price);

      if (!Number.isNaN(maxPrice)) {
        filter.price = {
          $lte: maxPrice,
        };
      }
    }

    // PROPERTY TYPE
    if (type) {
      const types = type
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (types.length) {
        filter.type = {
          $in: types,
        };
      }
    }

    // RATING
    if (rating !== undefined && rating !== "") {
      const minimumRating = Number(rating);

      if (!Number.isNaN(minimumRating)) {
        filter.rating = {
          $gte: minimumRating,
        };
      }
    }

    // BEDROOMS
    if (bedrooms !== undefined && bedrooms !== "") {
      const value = Number(bedrooms);

      if (!Number.isNaN(value) && value > 0) {
        filter.bedrooms = {
          $gte: value,
        };
      }
    }

    // BEDS
    if (beds !== undefined && beds !== "") {
      const value = Number(beds);

      if (!Number.isNaN(value) && value > 0) {
        filter.beds = {
          $gte: value,
        };
      }
    }

    // BATHROOMS
    if (bathrooms !== undefined && bathrooms !== "") {
      const value = Number(bathrooms);

      if (!Number.isNaN(value) && value > 0) {
        filter.bathrooms = {
          $gte: value,
        };
      }
    }

    // AMENITIES
    if (amenities) {
      const requestedAmenities = amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (requestedAmenities.length) {
        filter.amenities = {
          $all: requestedAmenities,
        };
      }
    }

    // BOOKING OPTIONS
    if (instantBook === "true") {
      filter["bookingOptions.instantBook"] = true;
    }

    if (selfCheckIn === "true") {
      filter["bookingOptions.selfCheckIn"] = true;
    }

    // ACCESSIBILITY
    if (stepFreeEntrance === "true") {
      filter["accessibility.stepFreeEntrance"] = true;
    }

    if (wideDoorways === "true") {
      filter["accessibility.wideDoorways"] = true;
    }

    // HOST STATUS
    if (hostStatus) {
      filter.hostStatus = hostStatus;
    }

    // SORTING
    let sortQuery = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-asc":
        sortQuery = {
          price: 1,
        };
        break;

      case "price-desc":
        sortQuery = {
          price: -1,
        };
        break;

      case "rating":
        sortQuery = {
          rating: -1,
          reviews: -1,
        };
        break;

      case "reviews":
        sortQuery = {
          reviews: -1,
        };
        break;

      case "newest":
        sortQuery = {
          createdAt: -1,
        };
        break;

      case "recommended":
      default:
        sortQuery = {
          rating: -1,
          reviews: -1,
        };
        break;
    }

    const properties = await Property.find(filter).sort(sortQuery).lean();

    let wishlistIds = [];

    if (req.user?._id) {
      const wishlist = await Wishlist.find({
        user: req.user._id,
        property: {
          $in: properties.map((property) => property._id),
        },
      })
        .select("property")
        .lean();

      wishlistIds = wishlist.map((item) => item.property.toString());
    }

    const result = properties.map((property) => ({
      ...property,

      id: property._id,

      loc: [property.location?.city, property.location?.country]
        .filter(Boolean)
        .join(", "),

      top: property.mapPosition?.top || "50%",
      left: property.mapPosition?.left || "50%",

      isFavorited: wishlistIds.includes(property._id.toString()),
    }));

    return res.json({
      success: true,
      count: result.length,
      properties: result,
    });
  } catch (error) {
    console.error("getProperties error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load properties",
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      await Wishlist.deleteOne({
        _id: existing._id,
      });

      return res.json({
        success: true,
        saved: false,
      });
    }

    await Wishlist.create({
      user: req.user._id,
      property: propertyId,
    });

    return res.json({
      success: true,
      saved: true,
    });
  } catch (error) {
    console.error("toggleWishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update wishlist",
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const wishlist = await Wishlist.find({
      user: req.user._id,
    })
      .populate("property")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("getWishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load wishlist",
    });
  }
};

module.exports = {
  getProperties,
  toggleWishlist,
  getWishlist,
};
