const express = require("express");
const cors = require("cors");
const { dbConfig } = require("./components/databaseConfig/dbConfig");
const app = express();
require("dotenv").config();
const UserRoute = require("./components/routers/UserRoute");
const GuestRoute = require("./components/routers/GuestRoute");
const FuneralDetailsRoute = require("./components/routers/FuneralDetailsRoute");

const PORT = process.env.PORT;
dbConfig(); // database configuration


app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", UserRoute);
app.use("/api", GuestRoute);
app.use("/api", FuneralDetailsRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Yala server running perfectly 😊😊😊😊."
    })
})


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});