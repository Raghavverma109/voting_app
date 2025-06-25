//start server
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const app = express();
const db = require('./db'); // Assuming db.js is in the same directory

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3030;

// Import the routes
const userRoutes = require('./routes/userRoutes'); 
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user' , userRoutes); // Use the User routes
app.use('/candidate' , candidateRoutes); // Use the Candidate routes

app.listen(port, () => {
    
    console.log(`Server is running on port ${port}`)});
