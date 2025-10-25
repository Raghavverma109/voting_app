const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require("path");

require("dotenv").config();
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const db = require('./db'); // MongoDB connection file

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const electionRoutes = require("./routes/electionRoutes");

// Allowed origins (for CORS)
const allowedOrigins = (
  process.env.VITE_Frontend_URL + "," + process.env.VITE_Backend_URL
)
  .split(",")
  .map(origin => origin.trim().replace(/\/$/, ""));


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));


// ✅ TEST ROUTE to check if backend is working
app.get("/", (req, res) => {
  res.send("✅ Backend is working fine!");
});


// Use other routes
app.use('/user', userRoutes);
app.use('/candidates', candidateRoutes);
app.use("/elections", electionRoutes);

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
