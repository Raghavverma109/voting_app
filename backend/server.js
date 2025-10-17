const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();


const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3030;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Import the routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const electionRoutes = require("./routes/electionRoutes");  

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use('/user', userRoutes); // Use the User routes
app.use('/candidates', candidateRoutes); // Use the Candidate routes
app.use("/elections", electionRoutes); // Use the Election routest

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
