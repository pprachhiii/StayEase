// routes/home.js
const express = require("express");
const Property = require("../models/property");
const router = express.Router();

const renderHome = async (req, res, next) => {
  try {
    const globeProperties = await Property.find({
      "geometry.type": "Point",
      "geometry.coordinates.0": { $exists: true },
      "geometry.coordinates.1": { $exists: true },
    })
      .select("title price rating reviews location images geometry")
      .lean();

    res.render("properties/home.ejs", { globeProperties });
  } catch (error) {
    next(error);
  }
};

router.get("/", renderHome);

router.get("/home", renderHome);

module.exports = router;
