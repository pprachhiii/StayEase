const Property = require("../models/property");
const Wishlist = require("../models/wishlist");

const getImageUrl = (file) => file?.path || file?.secure_url || file?.url;

const renderProperty = async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("owner", "username email")
    .populate({
      path: "reviewItems",
      populate: { path: "author", select: "email" },
    });
  if (!property) {
    req.flash("error", "That stay no longer exists.");
    return res.redirect("/properties");
  }
  return res.render("properties/show", { listing: property });
};

const newProperty = (req, res) => res.render("properties/new");

const createProperty = async (req, res) => {
  const listing = req.body.listing;
  const images = req.files?.length
    ? req.files.map(getImageUrl).filter(Boolean)
    : req.file
      ? [getImageUrl(req.file)]
      : [];

  const property = await Property.create({
    ...listing,
    owner: req.user._id,
    images,
    amenities: Array.isArray(listing.amenities)
      ? listing.amenities
      : listing.amenities
        ? [listing.amenities]
        : [],
  });

  req.flash("success", "Your stay is live.");
  return res.redirect(`/properties/${property._id}`);
};

const editProperty = async (req, res) => {
  const listing = await Property.findById(req.params.id);
  if (!listing) {
    req.flash("error", "That stay no longer exists.");
    return res.redirect("/properties");
  }
  return res.render("properties/edit", { listing });
};

const updateProperty = async (req, res) => {
  const updates = { ...req.body.listing };
  updates.amenities = Array.isArray(updates.amenities)
    ? updates.amenities
    : updates.amenities
      ? [updates.amenities]
      : [];
  const image = getImageUrl(req.file);
  if (image) updates.images = [image];

  const property = await Property.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!property) {
    req.flash("error", "That stay no longer exists.");
    return res.redirect("/properties");
  }
  req.flash("success", "Your stay was updated.");
  return res.redirect(`/properties/${property._id}`);
};

const deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  req.flash("success", "Your stay was removed.");
  return res.redirect("/properties");
};

// ========================================
// GET FILTERED PROPERTIES
// ========================================

const getProperties = async (req, res) => {
  try {
    const {
      location,
      search,
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
      sort = "recommended",
    } = req.query;

    const filter = {};
    const locationQuery = (location || search || "").trim();

    // LOCATION
    // Only filter by location when the request actually contains one.
    if (locationQuery) {
      const searchLocation = locationQuery;

      filter.$or = [
        {
          "location.city": {
            $regex: searchLocation,
            $options: "i",
          },
        },
        {
          "location.country": {
            $regex: searchLocation,
            $options: "i",
          },
        },
      ];
    }

    // PRICE
    if (price !== undefined && price !== "") {
      const maxPrice = Number(price);

      if (Number.isFinite(maxPrice) && maxPrice >= 0) {
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

      if (
        Number.isFinite(minimumRating) &&
        minimumRating >= 0 &&
        minimumRating <= 5
      ) {
        filter.rating = {
          $gte: minimumRating,
        };
      }
    }

    // BEDROOMS
    if (bedrooms !== undefined && bedrooms !== "") {
      const value = Number(bedrooms);

      if (Number.isFinite(value) && value > 0) {
        filter.bedrooms = {
          $gte: value,
        };
      }
    }

    // BEDS
    if (beds !== undefined && beds !== "") {
      const value = Number(beds);

      if (Number.isFinite(value) && value > 0) {
        filter.beds = {
          $gte: value,
        };
      }
    }

    // BATHROOMS
    if (bathrooms !== undefined && bathrooms !== "") {
      const value = Number(bathrooms);

      if (Number.isFinite(value) && value > 0) {
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

    // SORT
    let sortQuery;

    switch (sort) {
      case "price-asc":
        sortQuery = { price: 1, _id: 1 };
        break;

      case "price-desc":
        sortQuery = { price: -1, _id: 1 };
        break;

      case "rating":
        sortQuery = {
          rating: -1,
          reviews: -1,
          _id: 1,
        };
        break;

      case "reviews":
        sortQuery = {
          reviews: -1,
          rating: -1,
          _id: 1,
        };
        break;

      case "newest":
        sortQuery = {
          createdAt: -1,
          _id: 1,
        };
        break;

      case "recommended":
      default:
        sortQuery = {
          rating: -1,
          reviews: -1,
          createdAt: -1,
          _id: 1,
        };
    }

    const properties = await Property.find(filter).sort(sortQuery).lean();

    // FILTER OPTIONS
    const [propertyTypes, amenitiesList, maxPriceResult] = await Promise.all([
      Property.distinct("type"),
      Property.distinct("amenities"),
      Property.aggregate([
        {
          $group: {
            _id: null,
            maxPrice: {
              $max: "$price",
            },
          },
        },
      ]),
    ]);

    const maxPriceValue = maxPriceResult[0]?.maxPrice || 400;

    // WISHLIST
    let wishlistIds = [];

    const userId = req.user?._id || req.session?.userId;

    if (userId) {
      const wishlist = await Wishlist.find({
        user: userId,
        property: {
          $in: properties.map((property) => property._id),
        },
      })
        .select("property")
        .lean();

      wishlistIds = wishlist.map((item) => item.property.toString());
    }

    // RESULT
    const result = properties.map((property) => ({
      ...property,

      id: property._id.toString(),

      loc: [property.location?.city, property.location?.country]
        .filter(Boolean)
        .join(", "),

      top: property.mapPosition?.top || "50%",

      left: property.mapPosition?.left || "50%",

      isFavorited: wishlistIds.includes(property._id.toString()),
    }));

    const isAjax = req.xhr || req.headers.accept?.includes("application/json");

    if (isAjax) {
      return res.json({
        properties: result,
      });
    }

    // NORMAL PAGE REQUEST
    return res.render("properties/index", {
      properties: result,
      propertyTypes: propertyTypes.filter(Boolean).sort(),

      amenities: amenitiesList.filter(Boolean).sort(),

      maxPrice: maxPriceValue,

      search: {
        location: locationQuery,
        maxPrice: maxPriceValue,
      },
    });
  } catch (error) {
    console.error("getProperties error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load properties",
    });
  }
};

module.exports = {
  getProperties,
  newProperty,
  createProperty,
  renderProperty,
  editProperty,
  updateProperty,
  deleteProperty,
};
