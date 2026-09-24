const express = require("express");

const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware/auth");
const {
  getProperties,
  newProperty,
  createProperty,
  renderProperty,
  editProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/property");

const router = express.Router();

router.get("/", getProperties);
router.get("/new", isLoggedIn, newProperty);
router.post(
  "/",
  isLoggedIn,
  upload.array("images", 8),
  validateListing,
  wrapAsync(createProperty),
);
router.get("/:id", wrapAsync(renderProperty));
router.get("/:id/edit", isLoggedIn, isOwner, editProperty);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(updateProperty),
);
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteProperty));

module.exports = router;
