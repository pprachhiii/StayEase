const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        default: "Portugal",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },
    },

    geometry: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coordinates) => !coordinates || coordinates.length === 2,
          message: "Coordinates must contain longitude and latitude.",
        },
      },
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["Entire home", "Private room", "Unique stay", "Boutique hotel"],
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviewItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    beds: {
      type: Number,
      default: 1,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    bookingOptions: {
      instantBook: {
        type: Boolean,
        default: false,
      },

      selfCheckIn: {
        type: Boolean,
        default: false,
      },
    },

    accessibility: {
      stepFreeEntrance: {
        type: Boolean,
        default: false,
      },

      wideDoorways: {
        type: Boolean,
        default: false,
      },
    },

    hostStatus: {
      type: String,
      enum: ["Regular", "Superhost"],
      default: "Regular",
    },

    vibe: {
      type: String,
      default: "",
      trim: true,
    },

    mapPosition: {
      top: {
        type: String,
        default: "50%",
      },

      left: {
        type: String,
        default: "50%",
      },
    },
  },
  {
    timestamps: true,
  },
);

propertySchema.index({
  "location.city": 1,
});

propertySchema.index({
  "location.country": 1,
});

propertySchema.index({
  price: 1,
});

propertySchema.index({
  type: 1,
});

propertySchema.index({
  rating: -1,
  reviews: -1,
});

propertySchema.index({
  bedrooms: 1,
});

propertySchema.index({
  beds: 1,
});

propertySchema.index({
  bathrooms: 1,
});

propertySchema.index({
  amenities: 1,
});

propertySchema.index({
  "bookingOptions.instantBook": 1,
});

propertySchema.index({
  "bookingOptions.selfCheckIn": 1,
});

propertySchema.index({
  "accessibility.stepFreeEntrance": 1,
});

propertySchema.index({
  "accessibility.wideDoorways": 1,
});

propertySchema.index({
  hostStatus: 1,
});

propertySchema.index({
  createdAt: -1,
});

module.exports = mongoose.model("Property", propertySchema);
