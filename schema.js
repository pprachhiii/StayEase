const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    location: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
      address: Joi.string().allow("").default(""),
    }).required(),

    price: Joi.number().required().min(0),

    type: Joi.string().required(),

    rating: Joi.number().min(0).max(5),

    reviews: Joi.number().integer().min(0),

    bedrooms: Joi.number().integer().min(0),

    beds: Joi.number().integer().min(0),

    bathrooms: Joi.number().min(0),

    amenities: Joi.array().items(Joi.string()).default([]),

    bookingOptions: Joi.object({
      instantBook: Joi.boolean(),
      selfCheckIn: Joi.boolean(),
    }),

    accessibility: Joi.object({
      stepFreeEntrance: Joi.boolean(),
      wideDoorways: Joi.boolean(),
    }),

    hostStatus: Joi.string(),

    vibe: Joi.string(),

    images: Joi.array().items(Joi.string()).default([]),

    geometry: Joi.object({
      type: Joi.string().valid("Point"),
      coordinates: Joi.array().items(Joi.number()).length(2),
    }).allow(null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  review: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
});
