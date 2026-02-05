const api = require("../axios/api");
const FuneralDetails = require("../models/FuneralDetailsModel");
const Donation = require("../models/DonationModel");
const Guest = require("../models/GuestModel");

// Donate to event
exports.makeDonation = async (req, res) => {
    try {
        const { funeralUniqueCode, guestId, donationAmount } = req.body;

        // Verify guest exists
        const guest = await Guest.findById(guestId);
        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        const funeralDetails = await FuneralDetails.findOne({ uniqueCode: funeralUniqueCode, donation: true });
        if (!funeralDetails) {
            return res.status(404).json({ 
                success: false,
                message: "This event does not accept donations", 
                donationAllowed: false
            });
        }
        // Initialize transaction with Paystack
        const response = await api.post("transaction/initialize", { 
            email: "husktechgh@gmail.com",
            amount: donationAmount * 100, // Paystack expects amount in kobo/old pesewas
            metadata: {
                funeralUniqueCode,
                guestId
            }
        });

        // respond with authorization URL and reference
        const { authorization_url, reference } = response.data.data;

        res.status(200).json({ 
            success: true,
            message: "Donation initialized successfully",
            reference: reference,
            url: authorization_url, 
         });
    } catch (error) {
        console.error("Error making donation:", error);
        res.status(500).json({ 
            success: false,
            message: `Server error: ${error.message}` 
        });
    }
};

// Get donation by event unique code
exports.getDonationsByEvent = async (req, res) => {
    try {
        const { funeralUniqueCode } = req.params;
        const donations = await Donation.find({ funeralUniqueCode }).populate("guestId", "fullName phoneNumber");
        if (!donations) {
            return res.status(404).json({
                success: false,
                message: "No donations found for this event"
            });
        };

        res.status(200).json({
            success: true,
            message: "Donations retrieved successfully",
            donations 
        });
    }
    catch (error) {
        console.error("Error retrieving donations:", error);
        res.status(500).json({ 
            success: false,
            message: `Server error: ${error.message}` 
        });
    }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate("guestId", "name email");
        res.status(200).json({
            success: true,
            message: "Donations retrieved successfully",
            donations 
        });
    } catch (error) {
        console.error("Error retrieving donations:", error);
        res.status(500).json({ 
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};