const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    identity: {
        type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true
    },
    funeralUniqueCode: {
        type: [String], // organizers funeral codes
    },
    role: {
      type: String,
      enum: ["admin", "organiser"],
      default: "organiser",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);