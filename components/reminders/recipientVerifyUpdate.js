const cron = require("node-cron");
const TransferRecipient = require("../models/TransferRecipientModel");

const updateRecipientVerificationCodes = async () => {
    try {
        const now = new Date(); // current date
        //calculate 30 minutes ago
        const thirtyMinutesAgo = (now - 30 * 60 * 1000);

        // update transfer recipients whose verification is true 
        const transferRecipient = await TransferRecipient.updateMany({
            isVerified: true,
            updatedAt: { $lte: thirtyMinutesAgo }
        }, 
        {
            $set: { isVerified: false }
        });
        console.log(`Number of recipient codes updated: ${transferRecipient.modifiedCount}`);
        
        console.log(`Checking for expired verification codes`);
        
    } catch (error) {
        throw new Error(`Error occurred updating verification codes: ${error.message}`)
    }
};

cron.schedule("* * * * *", updateRecipientVerificationCodes);
module.exports = updateRecipientVerificationCodes;