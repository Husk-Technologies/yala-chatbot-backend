const FuneralDetails = require("../models/FuneralDetailsModel");
const Condolence = require("../models/Condolence");
const Guest = require("../models/GuestModel");

// Submit condolence message
exports.submitCondolence = async (req, res) => {
    try {
        const { funeralUniqueCode, guestId, message } = req.body;
        if(!funeralUniqueCode || !guestId || !message){
            return res.status(400).json({
                success: false,
                message: "funeralUniqueCode, guestId and message are required."
            });
        };

        // Check if funeralUniqueCode exists
        const funeralDetails = await FuneralDetails.findOne({ uniqueCode: funeralUniqueCode });
        if (!funeralDetails) {
            return res.status(404).json({
                success: false,
                message: "Funeral details not found for the provided unique code."
            });
        }

        // Check if condolence messages are allowed
        if(funeralDetails.condolence === false) {
            return res.status(403).json({
                success: false,
                message: "Condolence messages are disabled for this funeral."
            });
        }

        // Check if guest exists
        const guest = await Guest.findById(guestId);
        if(!guest){
            return res.status(404).json({
                success: false,
                message: "Guest not found"
            })
        };

        // Create new condolence message
        const newCondolence = new Condolence({
            funeralUniqueCode,
            guestId: guest._id,
            message
        });
        await newCondolence.save();

        return res.status(201).json({
            success: true,
            message: "Condolence message submitted successfully.",
            condolence: newCondolence
        });
    } catch (error) {
        console.error(`Error submitting condolence message: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "An error occurred while submitting the condolence message."
        });
    }
}

// Get condolence by unique code(organizer)
exports.getCondolenceByFuneralUniqueCode = async (req, res) => {
    try {
        const { funeralUniqueCode } = req.params;

        const condolences = await Condolence.find({
            funeralUniqueCode
        }).populate("guestId", "fullName phoneNumber");
        res.status(200).json({
            success: true,
            message: "Condolences fetched successfully.",
            condolences
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
}

// Get all condolences(admin)
exports.getAllCondolences = async (req, res) => {
    try {
        const condolences = await Condolence.find().populate(
          "guestId",
          "fullName phoneNumber",
        );;
        res.status(200).json({
            success: true,
            message: "Condolences fetched successfully.",
            condolences
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
}