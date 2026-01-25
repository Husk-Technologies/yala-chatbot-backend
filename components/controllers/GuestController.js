const Guest = require("../models/GuestModel");  
const { generateGuestToken } = require("../middleware/Authenticate");

// Check guest registration
exports.checkGuestRegistration = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "Phone number is required.",
      });
    };
    
    // Check if guest with the same phone number already exists
    const guest = await Guest.findOne({
      phoneNumber: phoneNumber,
    });
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found.",
      });
    };
    const token = await generateGuestToken(guest);
    
    res.status(200).json({
      success: true,
      message: "Guest fetched successfully.",
      guest: guest,
      token: token,
    });
  } catch (error) {
    console.log(`Error checking guest registration: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};  

// Register a new guest
exports.registerGuest = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if guest with the same phone number already exists
    const existingGuest = await Guest.findOne({
      phoneNumber: phoneNumber,
    });
    if (existingGuest) {
      return res.status(404).json({
        success: false,
        message: "Guest with this phone number already exists.",
      });
    }
    const guest = new Guest({
      fullName,
      phoneNumber,
    });
    await guest.save();

    const token = await generateGuestToken(guest);

    res.status(201).json({
      success: true,
      message: "Guest registered successfully",
      guest: guest,
      token: token,
    });
  } catch (error) {
        console.log(`Internal server error: ${error.message}`);
        res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
    });
  }
};

// Get all guests(admin)
exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).json({
      success: true,
      guests: guests,
    });
  } 
  catch (error) {
    console.log(`Internal server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Get guest by funeral unique code (organizer/admin)
exports.getGuestsByFuneralUniqueCode = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const guests = await Guest.find({
      funeralUniqueCode: uniqueCode,
    });
    res.status(200).json({
      success: true,
      message: "Guests fetched successfully",
      guests: guests,
    });
  }
  catch (error) {
    console.log(`Internal server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};