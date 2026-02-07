const mongoose = require("mongoose");

const transferRecipientSchema = new mongoose.Schema({
    organiserId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    transferType: {
        type: String,
        required: true
    },
    recipientCode: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true
    },
    bankCode: {
        type: String,
        required: true
    },
    verifiedCodes: {
        type: [String],
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("TransferRecipient", transferRecipientSchema);