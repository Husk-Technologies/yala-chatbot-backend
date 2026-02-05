const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
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
    transactionReference: {
      type: String,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
    },
    transactionChannel: {
      type: String,
      enum: [
        "card",
        "mobile_money",
        "bank_transfer",
      ],
    },
    donationAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donation", DonationSchema);