const { registerGuest, getAllGuests, checkGuestRegistration } = require("../controllers/GuestController");
const { verifyToken } = require("../middleware/Authenticate");
const express = require("express");
const router = express.Router();

router.post("/check-guest-registration", checkGuestRegistration);
router.post("/register-guest", registerGuest);
router.get("/all-guests", verifyToken, getAllGuests);

module.exports = router;