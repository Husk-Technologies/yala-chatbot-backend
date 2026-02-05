const { payStackWebhook } = require("../controllers/payStackController");
const express = require("express");
const router = express.Router();

router.post("/paystack-webhook", payStackWebhook);

module.exports = router;