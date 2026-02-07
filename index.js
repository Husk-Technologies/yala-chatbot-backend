const express = require("express");
const cors = require("cors");
const { dbConfig } = require("./components/databaseConfig/dbConfig");
const app = express();
require("dotenv").config();
const UserRoute = require("./components/routers/UserRoute");
const GuestRoute = require("./components/routers/GuestRoute");
const FuneralDetailsRoute = require("./components/routers/FuneralDetailsRoute");
const CondolenceRoute = require("./components/routers/CondolenceRoute");
const DonationRoute = require("./components/routers/DonationRoute");
const PaystackWebhookRoute = require("./components/routers/paystackWebhookRoute");
const TransferRecipient = require("./components/routers/TransferRecipientRoute");
const UpdateRecipientVerificationCode = require("./components/reminders/recipientVerifyUpdate");

const PORT = process.env.PORT;
dbConfig(); // database configuration

UpdateRecipientVerificationCode();

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(cors({ origin: "*" }));

app.use("/api", UserRoute);
app.use("/api", GuestRoute);
app.use("/api", FuneralDetailsRoute);
app.use("/api", CondolenceRoute);
app.use("/api", DonationRoute);
app.use("/api", PaystackWebhookRoute);
app.use("/api", TransferRecipient);

app.get("/", (req, res) => {
    res.json({
        message: "Yala server running perfectly 😊😊😊😊."
    })
})


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});