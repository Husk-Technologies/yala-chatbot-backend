const cron = require("node-cron");
const TransferRecipient = require("../models/TransferRecipientModel");

const updateRecipientVerificationCodes = async () => {
    try {
        
        console.log("I'm working");
        
    } catch (error) {
        throw new Error(`Error occurred updating verification codes: ${error.message}`)
    }
};

cron.schedule("*/30 * * * *", updateRecipientVerificationCodes);
module.exports = updateRecipientVerificationCodes;