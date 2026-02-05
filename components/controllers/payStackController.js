const Donation = require("../models/DonationModel");
const Guest = require("../models/GuestModel");
const FuneralDetails = require("../models/FuneralDetailsModel");
const axios = require("axios");
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;

exports.payStackWebhook = async (req, res) => {
    try {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.rawBody)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) return res.status(400).send('Invalid signature');
    
        const event = req.body;
        //Destructure event
        const { data } = event; 
        const { metadata } = data;
        const { funeralUniqueCode, guestId } = metadata;

        // Verify funeral details exist for the provided unique code
        const funeralDetails = await FuneralDetails.findOne({ uniqueCode: funeralUniqueCode });
        if (!funeralDetails) {
            return res.status(404).json({
                success: false,
                message: "Funeral details not found for the provided unique code"
            });
        };

        // Verify guest exists for the provided guest ID
        const guest = await Guest.findById(guestId);
        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest not found for the provided guest ID"
            });
        };


        if (event.event.startsWith('charge.')) {
            if(event.event === "charge.success"){
                const donation = new Donation({
                    funeralUniqueCode: funeralDetails.uniqueCode,
                    guestId: guest._id,
                    transactionReference: data.reference,
                    transactionStatus: data.status,
                    transactionChannel: data.channel,
                    donationAmount: data.amount / 100, // Paystack sends amount in old pesewas, convert to Cedis
                });
                await donation.save();
                console.log(`Data: ${JSON.stringify(event, null, 2)}`);
            }
        };

    } catch (error) {
        console.error("Error processing PayStack webhook:", error);
        res.status(500).json({ 
            success: false,
            message: `Error processing webhook : ${error.message}`
        });
    }
}