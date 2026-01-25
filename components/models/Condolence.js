const mongoose = require("mongoose");

const CondolenceSchema = new mongoose.Schema(
  {
    funeralUniqueCode: {
      type: String,
      required: true,
    },
    guestId: {
      type: mongoose.Types.ObjectId,
      ref: "Guest",
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

module.exports = mongoose.model("Condolence", CondolenceSchema);