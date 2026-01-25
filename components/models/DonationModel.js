const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  funeralUniqueCode: {
    type: String,
    required: true,
  },
  guestId: {
    type: mongoose.Types.ObjectId,
    ref: "Guest",
    required: true,
  },
  donationAmount: {
    type: Boolean,
  }
},{
    timestamps: true
});

module.exports = mongoose.model("Donation", DonationSchema);