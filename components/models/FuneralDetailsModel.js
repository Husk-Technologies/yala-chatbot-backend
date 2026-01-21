const mongoose = require("mongoose");

const FuneralDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
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
    type: String,
    required: true,
  },
  condolence: {
    type: Boolean,
  },
  donation: {
    type: Boolean,
  },
  brochureDownloadCount: {
    type: Number,
    default: 0,
  },
},{
    timestamps: true
});

exports.module = mongoose.model("FuneralDetails", FuneralDetailsSchema);