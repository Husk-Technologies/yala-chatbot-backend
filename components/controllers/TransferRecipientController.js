const TransferRecipient = require("../models/TransferRecipientModel");
const CashTransfer = require("../models/CashTranferModel");
const api = require("../axios/api");
const { v4 } = require("uuid");
const reference = v4();


// Get mobile money list
exports.getMobileMoneyList = async (req, res) => {
  try {
    const response = await api.get("bank?currency=GHS&type=mobile_money");
    // Destructure the data
    const { status, message, data } = response.data;

    res.status(200).json({
      success: status,
      message: message,
      data: data.map((data) => ({
        bankName: data.name,
        bankCode: data.code,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Get bank list
exports.getBankList = async (req, res) => {
  try {
    const response = await api.get("https://api.paystack.co/bank?country=ghana");
    // Destructure the data
    const { status, message, data } = response.data;

    res.status(200).json({
      success: status,
      message: message,
      data: data.map((data) => ({
        bankName: data.name,
        bankCode: data.code,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// create transfer recipient details
exports.createTransferRecipient = async (req, res) => {
    try {
    const { name, accountNumber, bankCode, organiserId, verifiedCodes } = req.body;
    if (!name || !accountNumber || !bankCode || !organiserId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const response = await api.post("transferrecipient", {
      type: "mobile_money", // mobile money for now
      name: name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "GHS",
    });

    // Destructure response data
    const { message, data } = response.data;
    
    // Check if recipient already exists
    const existingRecipient = await TransferRecipient.findOne({
      recipientCode: data.recipient_code,
    });
    if (existingRecipient)
      return res.status(400).json({ 
            success: false, 
            message: "recipient already exist" 
        });

    // Save recipient to database
    const newRecipient = new TransferRecipient({
      organiserId,
      transferType: data.type,
      recipientCode: data.recipient_code,
      accountName: data.name,
      accountNumber: data.details.account_number,
      bankName: data.details.bank_name,
      bankCode: data.details.bank_code,
      verifiedCodes: verifiedCodes.split(",").map((codes) => codes.trim()),
      isVerified: false,
    });
    const savedRecipient = await newRecipient.save();

    res.status(201).json({
      success: true,
      message: message,
      recipient: savedRecipient,
    });

  } catch (error) {
    res.status(500).json({
      success: true,
      message: `Internal server error: ${error.response?.data?.message || error.message}`,
    });
  }
};

// get the recipient details by organizer id
exports.getOrganiserRecipient = async (req, res) => {
    try {
        const { organiserId } = req.params;
        
        const transferRecipient = await TransferRecipient.findOne({ organiserId }).populate("organiserId", "firstName lastName");
        if(!transferRecipient) {
            return res.status(200).json({
                success: false,
                message: "Recipient not found",
            });
        };
        
        res.status(200).json({
            success: true,
            message: "recipient retrieved",
            recipient: transferRecipient
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        })
    }
};

// get the recipient details by organizer id
exports.getAllRecipients = async (req, res) => {
    try {
        const transferRecipient = await TransferRecipient.find().populate("organiserId", "firstName lastName");
        
        res.status(200).json({
            success: true,
            message: "recipients retrieved",
            recipients: transferRecipient
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        })
    }
};

exports.verifyRecipientCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { verifyCodes } = req.body;
        
        if(!verifyCodes) {
            return res.status(404).json({
                success: false,
                message: "Verify code field is required"
            });
        };

        // break codes into array
        const codes = verifyCodes.split(",").map(item => item.trim());
        const verifiedCodes = await TransferRecipient.findOneAndUpdate(
            { 
                _id: id,
                verifiedCodes: { $all: codes}, 
            },
            { isVerified: true},
            { new: true }
        );
        if(!verifiedCodes) {
            return res.status(404).json({
                success: false,
                message: "recipient not verified, check codes and try again"
            });
        };
        res.status(200).json({
            success: true,
            message: "recipient verified",
            recipient: {
                accountName: verifiedCodes.accountName,
                status: verifiedCodes.isVerified
            },
        });
        
    } catch (error) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${error.message}`,
        });
    }
};

// Send money to recipient
exports.TransferMoneyToRecipient = async (req, res) => {
  try {
    const { amount, accountNumber, organiserId } = req.body;

    // const existingMechanicBalance = await mechanicSubscriptionBalance.findOne({
    //   mechanicId: mechanicId,
    // });
    // if (amount <= 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Amount must be greater than zero",
    //   });
    // }

    // if (existingMechanicBalance.balanceAmount < amount) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Insufficient balance: ${existingMechanicBalance.balanceAmount.toFixed(2)}`,
    //   });
    // }

    // Verify recipient exists
    const existingRecipient = await TransferRecipient.findOne({
      accountNumber,
      isVerified: true,
    });
    if (!existingRecipient) {
      return res.status(400).json({
        success: true,
        message: "recipient not found",
      });
    }

    const response = await api.post("transfer", {
      source: "balance",
      amount: amount * 100, // amount in pesewas from ghana cedi
      reference: `acv_${reference}`,
      recipient: existingRecipient.recipientCode,
      reason: "Mechanic payment",
    });

    // Destructure response data
    const { status, message, data } = response.data;

    // Save transfer details to database
    const newTransfer = new CashTransfer({
        userId: mechanicId,
        name: existingRecipient.name,
        accountNumber: existingRecipient.accountNumber,
        bankCode: existingRecipient.bankCode,
        amount: amount,
        recipientCode: existingRecipient.recipientCode,
        reference: data.reference,
        transferCode: data.transfer_code,
        transferStatus: "pending",
    });
    const savedTransfer = await newTransfer.save();

    res.status(200).json({
      success: status,
      message: message,
      data: savedTransfer,
    });
  } catch (error) {
    console.error("Error sending money:", error);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message} - ${error.response?.data?.message}`,
    });
  }
};
