const mongoose = require("mongoose");

const FuneralDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    uniqueCode: {
      type: String,
      required: true,
    },
    brochure: {
      type: String,
      required: true,
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