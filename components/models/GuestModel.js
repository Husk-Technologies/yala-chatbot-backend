const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

exports.module = mongoose.model("Guest", GuestSchema);