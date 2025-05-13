const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware/auth");
const {
  showRegisterForm,
  showLoginForm,
  logoutUser,
  loginUser,
  registerUser,
} = require("../controllers/auth");

router.route("/register").get(showRegisterForm).post(wrapAsync(registerUser));

router
  .route("/login")
  .get(showLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req, res) => {
      const redirectUrl = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    }
  );

// Logout Route
router.get("/logout", logoutUser);

module.exports = router;
