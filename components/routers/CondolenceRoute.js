const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/Authenticate");
const { submitCondolence, getAllCondolences, getCondolenceByFuneralUniqueCode } = require("../controllers/CondolenceController");

router.post("/condolence-submit", verifyToken, submitCondolence); // Submit condolence message
router.get("/condolence-funeral/:funeralUniqueCode", verifyToken, getCondolenceByFuneralUniqueCode); // Get condolences by funeral unique code (organizer)
router.get("/condolences", verifyToken, getAllCondolences); // Get all condolences (admin)
module.exports = router;