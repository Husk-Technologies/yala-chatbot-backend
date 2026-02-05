const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.paystack.co/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  },
});
module.exports = api;