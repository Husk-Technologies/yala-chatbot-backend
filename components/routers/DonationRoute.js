const { makeDonation, getDonationsByEvent, getAllDonations, getAllDonationBalance, getOrganiserDonationBalance } = require("../controllers/DonationController");
const { verifyToken } = require("../middleware/Authenticate");
const express = require("express");
const router = express.Router();

router.post("/make-donation", verifyToken, makeDonation);
router.get("/fetch-donation/:funeralUniqueCode", verifyToken, getDonationsByEvent);
router.get("/fetch-donations", verifyToken, getAllDonations);
router.get("/fetch-organiser-balance/:organiserId", verifyToken, getOrganiserDonationBalance);
router.get("/fetch-donation-balance", verifyToken, getAllDonationBalance);

module.exports = router;