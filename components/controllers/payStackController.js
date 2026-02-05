const Donation = require("../models/DonationModel");
const Guest = require("../models/GuestModel");
const FuneralDetails = require("../models/FuneralDetailsModel");
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;

exports.payStackWebhook = async (req, res) => {
    try {
        const hash = crypto.createHmac('sha512', secret).update(req.rawBody).digest('hex');
        if (hash !== req.headers['x-paystack-signature']) return res.status(400).send('Invalid signature');
    
        const event = req.body;
        //Destructure event
        const { data } = event; 
        const { metadata } = data;
        const { funeralUniqueCode, guestId } = metadata;

        // check if there is no metadata
        if(!funeralUniqueCode || !guestId) return res.sendStatus(200)


        // Verify funeral details exist for the provided unique code
        const funeralDetails = await FuneralDetails.findOne({ uniqueCode: funeralUniqueCode });
        if (!funeralDetails) {
            return res.sendStatus(200);
        };

        // Verify guest exists for the provided guest ID
        const guest = await Guest.findById(guestId);
        if (!guest) {
            return res.sendStatus(200);
        };

        // check existing donation
        const existingDonation = await Donation.findOne({
            transactionReference: data.reference,
        })
        if(existingDonation){
            return res.sendStatus(200);
        }

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

        res.status(200).json({
            success: true,
            message: "OK"
        })

    } catch (error) {
        console.error("Error processing PayStack webhook:", error);
        res.status(500).json({ 
            success: false,
            message: `Error processing webhook : ${error.message}`
        });
    }
}