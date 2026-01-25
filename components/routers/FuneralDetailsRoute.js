const {
  uploadFuneralDetails,
  updateFuneralDetails,
  deleteFuneralDetails,
  getAllFuneralDetails,
  getFuneralDetailsByUniqueCode,
  verifyFuneralDetails,
  getFuneralBrochure,
  getFuneralLocation,
} = require("../controllers/FuneralDetailsController");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // Temporary storage for uploaded files
const { verifyToken } = require("../middleware/Authenticate");

router.post("/funeral-details", verifyToken, upload.single("brochure"), uploadFuneralDetails); // upload funeral details with brochure file
router.put("/funeral-details/:id", verifyToken, upload.single("brochure"), updateFuneralDetails); // update funeral details with brochure file
router.delete("/funeral-details/:id", verifyToken, deleteFuneralDetails); // delete funeral details
router.get("/funeral-details", verifyToken, getAllFuneralDetails); // get all funeral details
router.get("/funeral-details/:uniqueCode", verifyToken, getFuneralDetailsByUniqueCode); // get funeral details by unique code
router.get("/verify-funeral-details/:uniqueCode", verifyToken, verifyFuneralDetails); // verify funeral details by unique code
router.get("/funeral-brochure/:uniqueCode", verifyToken, getFuneralBrochure); // get funeral brochure by unique code
router.get("/funeral-location/:uniqueCode", verifyToken, getFuneralLocation); // get funeral location by unique code

module.exports = router;
