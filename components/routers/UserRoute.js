const { verifyToken } = require("../middleware/Authenticate");
const { registerAdmin, registerOrganiser, generateId, login, addFuneralCode, getAllUserData, getUserData, getAllIdentity } = require("../controllers/UserController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin); // register admin
router.post("/register-organiser", registerOrganiser); // register admin
router.post("/login", login); // login admin/organizer
router.put("/add-funeral-code/:id", verifyToken, addFuneralCode); // generate ID
router.get("/generate-id", verifyToken, generateId); // generate ID
router.get("/all-users", verifyToken, getAllUserData); // get all users data
router.get("/user/:id", verifyToken, getUserData); // get user data
router.get("/all-identity", verifyToken, getAllIdentity); // get all identity

module.exports = router;