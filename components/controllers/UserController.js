const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Identity = require("../models/IdentityModel");
const { generateToken } = require("../middleware/Authenticate");

// Auto generate ID
exports.generateId = async (req, res) => {
  try {
    const autoGenerateIdentityDigit = () => {
      const digit = Math.floor(100000000 * Math.random())
        .toString()
        .padStart(8, "0");
      return digit;
    };

    // Check if ID already exist
    const existingIdentity = await Identity.findOne({
      identity: `YC-${autoGenerateIdentityDigit()}`,
    });
    if (existingIdentity) {
      return res.status(404).json({
        success: false,
        message: "ID already exist.",
      });
    }

    const identity = new Identity({
      identity: `YC-${autoGenerateIdentityDigit()}`,
    });
    const savedIdentity = await identity.save();

    res.status(200).json({
      message: "ID generated",
      identity: savedIdentity.identity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Admin registration
exports.registerAdmin = async (req, res) => {
  try {
    const { identity, firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if ID exist
    const existingIdentity = await Identity.findOne({ identity });
    if (!existingIdentity) {
      return res.status(404).json({
        success: false,
        message: "Invalid identity. Only admins can register.",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or phone number already in use." });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      identity: existingIdentity.identity,
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    });
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      role: savedUser.role,
    });
  } catch (error) {
    console.log(`Internal server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Organizer registration
exports.registerOrganiser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "All fields are required.",
      });
    }


    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or phone number already in use." });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "organiser",
    });
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "Organiser created successfully",
      role: savedUser.role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Add funeral code to organizer
exports.addFuneralCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { funeralUniqueCode } = req.body;

        if(!funeralUniqueCode){
            return res.status(404).json({
                success: false,
                message: "Filed is required."
            })
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if(user.funeralUniqueCode.includes(funeralUniqueCode)){
            return res.status(404).json({
              success: false,
              message: "Code already added.",
            });
        }

        const updateFuneralCode = await User.findByIdAndUpdate(id, {
          funeralUniqueCode: { $push: funeralUniqueCode },
        }, { new: true });

        res.status(200).json({
          success: true,
          message: "Added successfully",
          funeralUniqueCode: updateFuneralCode.funeralUniqueCode
        });
        
    } catch (error) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${error.message}`,
        });
    }
};

// Admin / Organizer login
exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user exists
    const user = await User.findOne({
        $or: [{ email }, { phoneNumber }]
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Credential invalid, please try again." });

    const token = await generateToken(user); // generate token
    res.status(201).json({
      success: true,
      message: "Logged in successfully",
      user: user,
      token: token
    });
  } catch (error) {
    console.log(`Internal server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Get all users data
exports.getUserData = async (req, res) => {
    try {
      const user = await User.find();

      res.status(200).json({
        success: true,
        message: "Added successfully",
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
};

// Get user data
exports.getUserData = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Added successfully",
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
};
