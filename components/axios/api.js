const axios = require("axios");

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});
module.exports = api;