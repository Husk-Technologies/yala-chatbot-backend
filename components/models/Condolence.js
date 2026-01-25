const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema(
  {
    funeralUniqueCode: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Guest", GuestSchema);