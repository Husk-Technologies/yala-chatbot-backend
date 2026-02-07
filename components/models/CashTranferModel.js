const mongoose = require("mongoose");

const cashTransferSchema = new mongoose.Schema({
  organiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  bankCode: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  recipientCode: {
    type: String,
  },
  reference: {
    type: String,
    required: true,
  },
  transferCode: {
    type: String,
    required: true,
  },
  transferStatus: {
    type: String,
    required: true,
    enum: ["pending", "successful", "failed", "reversed"],
    default: "pending",
  },
}, {
    timestamps: true
}); 

module.exports = mongoose.model("CashTransfer", cashTransferSchema);