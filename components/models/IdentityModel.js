const mongoose = require("mongoose");

const IdentitySchema = new mongoose.Schema({
    identity: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Identity", IdentitySchema);