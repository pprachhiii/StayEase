// routes/home.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("listings/home.ejs"); // Added listings/ prefix
});

router.get("/home", (req, res) => {
  res.render("listings/home.ejs"); // Added listings/ prefix
});

module.exports = router;
