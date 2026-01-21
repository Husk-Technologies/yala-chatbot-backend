const { verifyToken } = require("../middleware/Authenticate");
const { registerAdmin, registerOrganiser, generateId, login } = require("../controllers/UserController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin); // register admin
router.post("/register-organiser", registerOrganiser); // register admin
router.post("/login", login); // login admin/organizer
router.get("/generate-id", generateId); // generate ID

module.exports = router;