const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  funeralUniqueCode: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  donationAmount: {
    type: Boolean,
  }
},{
    timestamps: true
});

exports.module = mongoose.model("Donation", DonationSchema);