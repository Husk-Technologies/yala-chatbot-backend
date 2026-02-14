const mongoose = require("mongoose");

const FuneralDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organiser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    uniqueCode: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    brochure: {
      type: String,
    },
    location: {
      day: String,
      time: Date,
      name: String,
      link: String,
    },
    condolence: {
      type: Boolean,
    },
    donation: {
      type: Boolean,
    },
    date: {
      type: Date,
    },
    brochureDownloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("FuneralDetails", FuneralDetailsSchema);
