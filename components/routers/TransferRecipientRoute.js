const { getMobileMoneyList, getBankList, createTransferRecipient, getOrganiserRecipient, } = require("../controllers/TransferRecipientController");
const { verifyToken } = require("../middleware/Authenticate");
const router = require("express").Router();

router.get("/fetch-mobile-money", verifyToken, getMobileMoneyList); // fetch the list of mobile money
router.get("/fetch-banks", verifyToken, getBankList); // fetch the list of banks
router.post("/create-transfer-recipient", verifyToken, createTransferRecipient); // create recipient
router.get("/fetch-recipient/:organiserId", verifyToken, getOrganiserRecipient) // get the recipient

module.exports = router