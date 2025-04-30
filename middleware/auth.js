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
