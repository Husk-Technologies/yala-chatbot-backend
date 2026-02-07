const api = require("../axios/api");
const FuneralDetails = require("../models/FuneralDetailsModel");
const Donation = require("../models/DonationModel");
const OrganiserDonationBalance = require("../models/organiserDonationBalanceModel");
const Guest = require("../models/GuestModel");

// Donate to event
exports.makeDonation = async (req, res) => {
  try {
    const { funeralUniqueCode, guestId, donationAmount } = req.body;

    if (!funeralUniqueCode || !guestId || !donationAmount) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Verify guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const funeralDetails = await FuneralDetails.findOne({
      uniqueCode: funeralUniqueCode,
      donation: true,
    });
    if (!funeralDetails) {
      return res.status(404).json({
        success: false,
        message: "This event does not accept donations",
        donationAllowed: false,
      });
    }
    // Initialize transaction with Paystack
    const response = await api.post("transaction/initialize", {
      email: "huskpaystackreceipt@gmail.com",
      amount: donationAmount * 100, // Paystack expects amount in kobo/old pesewas
      metadata: {
        funeralUniqueCode,
        guestId,
      },
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
      message: `Server error: ${error.message}`,
    });
  }
};

// Get donation by event unique code
exports.getDonationsByEvent = async (req, res) => {
  try {
    const { funeralUniqueCode } = req.params;
    const donations = await Donation.find({ funeralUniqueCode }).populate(
      "guestId",
      "fullName phoneNumber",
    );
    if (!donations) {
      return res.status(404).json({
        success: false,
        message: "No donations found for this event",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donations retrieved successfully",
      donations,
    });
  } catch (error) {
    console.error("Error retrieving donations:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get all donations (admin)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("guestId", "name email");
    res.status(200).json({
      success: true,
      message: "Donations retrieved successfully",
      donations,
    });
  } catch (error) {
    console.error("Error retrieving donations:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// get organizer donation balance(organizer)
exports.getOrganiserDonationBalance = async (req, res) => {
  try {
    const { organiserId } = req.params;
    const donationBalance = await OrganiserDonationBalance.findOne({
      organiserId,
    });
    res.status(200).json({
      success: true,
      message: "Balance retrieved successfully",
      balance: donationBalance,
    });
  } catch (error) {
    console.error("Error retrieving donations:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// get all donation balance (admin)
exports.getAllDonationBalance = async (req, res) => {
  try {
    const donationBalance = await OrganiserDonationBalance.find().populate("organiserId", "firstName lastName phoneNumber");
    res.status(200).json({
      success: true,
      message: "Balance retrieved successfully",
      balance: donationBalance,
    });

  } catch (error) {
    console.error("Error retrieving donations:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
