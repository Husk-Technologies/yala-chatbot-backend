const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
      required: true,
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
        type: String, // organisers funeral code
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

exports.module = mongoose.model("User", UserSchema);