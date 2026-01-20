const express = require("express");
const cors = require("cors");
const { dbConfig } = require("./components/databaseConfig/dbConfig");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
dbConfig(); // database configuration

app.use(express.json());
app.use(cors({ origin: "*" }));


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});