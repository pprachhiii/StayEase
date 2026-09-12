const User = require("../models/user");

module.exports.showRegisterForm = async (req, res) => {
  res.render("auth/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists with this email");
      return res.redirect("/register");
    }

    // Create new User
    const newUser = new User({ username, email });

    // Register user with password
    await User.register(newUser, password); // passport-local-mongoose handles hashing

    req.login(newUser, (err) => {
      // Use req.login, not res.login
      if (err) {
        return next(err);
      }
      req.flash("success", "Registration successful! Welcome to StayEase!");
      res.redirect("/home");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/register");
  }
};

module.exports.showLoginForm = async (req, res) => {
  res.render("auth/login");
};

module.exports.loginUser = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/home"; // Use the redirectUrl from saveRedirectUrl middleware
  res.redirect(redirectUrl);
};

module.exports.logoutUser = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successful!");
    res.redirect("/home");
  });
};
