const { registerGuest, getAllGuests, checkGuestRegistration, getGuestsByFuneralUniqueCode } = require("../controllers/GuestController");
const { verifyToken } = require("../middleware/Authenticate");
const express = require("express");
const router = express.Router();

router.post("/check-guest-registration", checkGuestRegistration);
router.post("/register-guest", registerGuest);
router.get("/all-guests", verifyToken, getAllGuests);
router.get("/guests-by-funeral/:uniqueCode", verifyToken, getGuestsByFuneralUniqueCode);

module.exports = router;