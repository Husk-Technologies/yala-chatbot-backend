const { getMobileMoneyList, getBankList, createTransferRecipient, getOrganiserRecipient, getAllRecipients, verifyRecipientCode } = require("../controllers/TransferRecipientController");
const { verifyToken } = require("../middleware/Authenticate");
const router = require("express").Router();

router.get("/fetch-mobile-money", verifyToken, getMobileMoneyList); // fetch the list of mobile money
router.get("/fetch-banks", verifyToken, getBankList); // fetch the list of banks
router.post("/create-transfer-recipient", verifyToken, createTransferRecipient); // create recipient
router.get("/fetch-recipients", verifyToken, getAllRecipients) // get all recipients
router.get("/fetch-recipient/:organiserId", verifyToken, getOrganiserRecipient) // get the recipient
router.post("/verify-recipient-codes", verifyToken, verifyRecipientCode) // verify recipient codes

module.exports = router