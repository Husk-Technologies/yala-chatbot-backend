const { makeDonation, getDonationsByEvent, getAllDonations } = require("../controllers/DonationController");
const { verifyToken } = require("../middleware/Authenticate");
const express = require("express");
const router = express.Router();

router.post("/make-donation", verifyToken, makeDonation);
router.get("/fetch-donation/:funeralUniqueCode", verifyToken, getDonationsByEvent);
router.get("/fetch-donations", verifyToken, getAllDonations);

module.exports = router;