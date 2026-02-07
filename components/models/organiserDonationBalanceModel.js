const mongoose = require("mongoose");

const organiserDonationBalanceSchema = new mongoose.Schema({
    organiserId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("OrganiserDonationBalance", organiserDonationBalanceSchema);