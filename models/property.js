const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("Property", propertySchema);
