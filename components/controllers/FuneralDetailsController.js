const cloudinary = require("../middleware/cloudinary");
const FuneralDetails = require("../models/FuneralDetailsModel");
const Guest = require("../models/GuestModel");

// upload funeral details controller
exports.uploadFuneralDetails = async (req, res) => {
  try {
    const {
      userId,
      description,
      uniqueCode,
      location,
      condolence,
      donation,
      date,
    } = req.body;

    const existingFuneral = await FuneralDetails.findOne({ uniqueCode });
    if (existingFuneral) {
      return res.status(400).json({
        message: "Funeral details with this unique code already exist.",
      });
    }

    let brochure = "";
    const brochureFile = req.file; // Access the uploaded file
    if (brochureFile) {
      // Upload brochure to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(brochureFile.path, {
        folder: "yala_funeral_files",
        resource_type: "auto",
      });
      brochure = uploadResult.secure_url;
    }

    // Create new funeral details document
    const newFuneralDetails = new FuneralDetails({
      userId,
      description,
      uniqueCode,
      brochure: brochure,
      location,
      condolence,
      donation,
      date,
    });
    await newFuneralDetails.save();

    res.status(201).json({
      message: "Funeral details uploaded successfully",
      funeralDetails: newFuneralDetails,
    });
  } catch (error) {
    console.error("Error uploading funeral details:", error);
    res
      .status(500)
      .json({ message: `Error uploading funeral details: ${error.message}` });
  }
};

// update funeral details controller can be added here
exports.updateFuneralDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      description,
      uniqueCode,
      location,
      condolence,
      donation,
      date,
    } = req.body;

    // check existing funeral
    const existingFuneral = await FuneralDetails.findById(id);
    if (!existingFuneral) {
      return res.status(400).json({
        message: "Funeral details not found.",
      });
    }

    // access the uploaded file
    const brochureFile = req.file;

    let brochurePath;
    // check if brochure exist in path
    if (brochureFile) {
      // Upload brochure to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(brochureFile.path, {
        folder: "yala_funeral_files",
        resource_type: "auto",
      });
      brochurePath = uploadResult.secure_url;
    } else {
      brochurePath = existingFuneral.brochure;
    }

    console.log(brochurePath);

    // Create new funeral details document
    const updateFuneralDetails = await FuneralDetails.findByIdAndUpdate(
      id,
      {
        userId,
        description,
        uniqueCode,
        brochure: brochurePath,
        location,
        condolence,
        donation,
        date,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Funeral details updated successfully",
      funeralDetails: updateFuneralDetails,
    });
  } catch (error) {
    console.error("Error uploading funeral details:", error);
    res
      .status(500)
      .json({ message: `Error uploading funeral details: ${error.message}` });
  }
};

// delete funeral details
exports.deleteFuneralDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFuneral = await FuneralDetails.findById(id);
    if (!existingFuneral) {
      return res.status(400).json({
        message: "Funeral details not found.",
      });
    }
    await FuneralDetails.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Funeral details deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting funeral details:", error);
    res
      .status(500)
      .json({ message: `Error deleting funeral details: ${error.message}` });
  }
};

// get funeral all details (admin)
exports.getAllFuneralDetails = async (req, res) => {
  try {
    const funeralDetails = await FuneralDetails.find()
      .sort({ createdAt: -1 })
      .populate("userId", " firstName lastName")
      .populate("organiser", " firstName lastName");
    res.status(200).json({
      success: true,
      message: "funeral details fetched",
      funeralDetails,
    });
  } catch (error) {
    console.error("Error fetching funeral details:", error);
    res
      .status(500)
      .json({ message: `Error fetching funeral details: ${error.message}` });
  }
};

// get funeral details by unique code
exports.getFuneralDetailsByUniqueCode = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const funeralDetails = await FuneralDetails.findOne({
      uniqueCode,
    });
    if (!funeralDetails) {
      return res.status(404).json({
        success: false,
        message: "Funeral details not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Funeral details fetched successfully",
      funeralDetails,
    });
  } catch (error) {
    console.error("Error fetching funeral details:", error);
    res
      .status(500)
      .json({ message: `Error fetching funeral details: ${error.message}` });
  }
};

// verify funeral details with unique code
exports.verifyFuneralDetails = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const guestId = req.user.id; // Get guest ID from the verified token
    const funeralDetails = await FuneralDetails.findOne({
      uniqueCode,
    });
    if (!funeralDetails) {
      return res.status(404).json({
        success: false,
        message: "Funeral details not found",
      });
    }
    // Check if guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }
    // Check if guest has already verified for this funeral
    if (guest.funeralUniqueCode.includes(uniqueCode)) {
      return res.status(404).json({
        success: false,
        message: "Already verified for this funeral",
        description: funeralDetails.description,
        uniqueCode: funeralDetails.uniqueCode,
      });
    }
    const updateGuestFuneralUniqueCode = await Guest.findByIdAndUpdate(
      guestId,
      { $push: { funeralUniqueCode: uniqueCode } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Funeral details verified successfully",
      description: funeralDetails.description,
      uniqueCode: funeralDetails.uniqueCode,
      guest: updateGuestFuneralUniqueCode.funeralUniqueCode,
    });
  } catch (error) {
    console.error("Error verifying funeral details:", error);
    res
      .status(500)
      .json({ message: `Error verifying funeral details: ${error.message}` });
  }
};

// get funeral brochure
exports.getFuneralBrochure = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const funeralDetails = await FuneralDetails.findOne({
      uniqueCode,
    });
    if (!funeralDetails) {
      return res.status(404).json({
        success: false,
        message: "Funeral details not found",
      });
    }

    if (funeralDetails.brochure === "") {
      return res.status(404).json({
        success: false,
        message: "Does not have brochure",
      });
    }
    // Increment brochure download count
    funeralDetails.brochureDownloadCount += 1;
    await funeralDetails.save();
    res.status(200).json({
      success: true,
      message: "Funeral brochure fetched successfully",
      brochureUrl: funeralDetails.brochure,
      brochureDownloadCount: funeralDetails.brochureDownloadCount,
    });
  } catch (error) {
    console.error("Error fetching funeral brochure:", error);
    res
      .status(500)
      .json({ message: `Error fetching funeral brochure: ${error.message}` });
  }
};

// get funeral location
exports.getFuneralLocation = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const funeralDetails = await FuneralDetails.findOne({
      uniqueCode,
    });
    if (!funeralDetails) {
      return res.status(404).json({
        success: false,
        message: "Funeral details not found",
      });
    }
    if (!funeralDetails.location) {
      return res.status(404).json({
        success: false,
        message: "Funeral location not available",
      });
    }

    res.status(200).json({
      success: true,
      message: "Funeral location fetched successfully",
      location: funeralDetails.location,
      date: funeralDetails.date,
    });
  } catch (error) {
    console.error("Error fetching funeral brochure:", error);
    res
      .status(500)
      .json({ message: `Error fetching funeral brochure: ${error.message}` });
  }
};
