const Donation = require("../models/DonationModel");
const OrganiserDonationBalance = require("../models/organiserDonationBalanceModel");
const CashTransfer = require("../models/CashTranferModel");
const TransferRecipient = require("../models/TransferRecipientModel");
const Guest = require("../models/GuestModel");
const User = require("../models/UserModel");
const FuneralDetails = require("../models/FuneralDetailsModel");
const crypto = require("crypto");
const secret = process.env.PAYSTACK_SECRET_KEY;

exports.payStackWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac("sha512", secret).update(req.rawBody).digest("hex");
    if (hash !== req.headers["x-paystack-signature"])
      return res.status(400).send("Invalid signature");

    const event = req.body;
    //Destructure event
    const { data } = event;
    
    // event donation check
    if (event.event === "charge.success") {
    const metadata = data?.metadata || {};
      // destructure metadata
      const { funeralUniqueCode, guestId } = metadata;
      // check if there is no metadata
      if (!funeralUniqueCode || !guestId) return res.sendStatus(200);

      // Verify funeral details exist for the provided unique code
      const funeralDetails = await FuneralDetails.findOne({
        uniqueCode: funeralUniqueCode,
      });
      if (!funeralDetails) {
        return res.sendStatus(200);
      }

      // Verify guest exists for the provided guest ID
      const guest = await Guest.findById(guestId);
      if (!guest) {
        return res.sendStatus(200);
      }

      // check existing donation
      const existingDonation = await Donation.findOne({
        transactionReference: data.reference,
      });
      if (existingDonation) {
        return res.sendStatus(200);
      }

      // check existing organizer with the funeral unique code
      const existingOrganiser = await User.findOne({
        funeralUniqueCode,
      });
      if (!existingOrganiser) {
        return res.sendStatus(200);
      }

      // record to database
      const donation = new Donation({
        funeralUniqueCode: funeralDetails.uniqueCode,
        guestId: guest._id,
        transactionReference: data.reference,
        transactionStatus: data.status,
        transactionChannel: data.channel,
        donationAmount: data.amount / 100, // Paystack sends amount in old pesewas, convert to Cedis
      });
      await donation.save();

      // add amount to organizer's balance
      await OrganiserDonationBalance.findOneAndUpdate(
        {
          organiserId: existingOrganiser._id,
        },
        {
          $inc: { balance: donation.donationAmount },
        },
        {
          new: true,
        },
      );
    }

    // transfer cash to recipient check
    if (event.event.startsWith("transfer.")) {
      // check if successful
      if (event.event === "transfer.success") {
          // update recipient cash transfer status
        //   const updateCashTransferStatus = await CashTransfer.findOneAndUpdate(
        //     {
        //       transferCode: data.transfer_code,
        //     },
        //     {
        //       transferStatus: "successful",
        //     },
        //     {
        //       new: true,
        //     },
        //   );
          const updateCashTransferStatus = await CashTransfer.findOne({
            transferCode: data.transfer_code,
          });
            updateCashTransferStatus.transferStatus = "successful";
            await updateCashTransferStatus.save();
            console.log(`Data: ${JSON.stringify(updateCashTransferStatus, null, 2)}`);

        // subtract amount from recipient balance
        const updateOrganiserBalance = await OrganiserDonationBalance.findOne({
          organiserId: updateCashTransferStatus.organiserId,
        });
        updateOrganiserBalance.balance -= updateCashTransferStatus.amount;
        await updateOrganiserBalance.save();
      };

      // check if failed
      if (event.event === "transfer.failed") {
        // update recipient cash transfer status
        const updateCashTransferStatus = await CashTransfer.findOne({
          transferCode: data.transfer_code,
        });
        updateCashTransferStatus.transferStatus = "failed";
        await updateCashTransferStatus.save();
      };

      // check if reversed
      if (event.event === "transfer.reversed") {
        // update recipient cash transfer status
        const updateCashTransferStatus = await CashTransfer.findOne({
          transferCode: data.transfer_code,
        });
        updateCashTransferStatus.transferStatus = "reversed";
        await updateCashTransferStatus.save();
      };
    }

    res.status(200).json({
      success: true,
      message: "OK",
    });
  } catch (error) {
    console.error("Error processing PayStack webhook:", error);
    res.status(500).json({
      success: false,
      message: `Error processing webhook : ${error.response?.data?.message || error.message}`,
    });
  }
};
