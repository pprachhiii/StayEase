require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Route files (FIXED Duplicate Declaration)
const homeRoutes = require("./routes/home");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/property");
const wishlistRoutes = require("./routes/wishlist");

const errorMiddleware = require("./middleware/error");

// Connect to MongoDB
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session configuration
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  touchAfter: 24 * 3600,
});
const sessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET_KEY || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.USE_SECURE_COOKIE === "true",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set locals for every response
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

// Routes (FIXED Mounting)
app.use("/", homeRoutes); // Mounts home routes (e.g., handles '/' or '/home')
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", authRoutes);
app.use("/properties", propertyRoutes);

app.use("/wishlist", wishlistRoutes);

app.use(errorMiddleware);

// Catch-all Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
