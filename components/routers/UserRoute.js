const { verifyToken } = require("../middleware/Authenticate");
const { registerAdmin, registerOrganiser, generateId, login, addFuneralCode } = require("../controllers/UserController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin); // register admin
router.post("/register-organiser", registerOrganiser); // register admin
router.post("/login", login); // login admin/organizer
router.put("/add-funeral-code/:id", verifyToken, addFuneralCode); // generate ID
router.get("/generate-id", generateId); // generate ID

module.exports = router;