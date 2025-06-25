const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
const mongoURL = 'mongodb://localhost:27017/voting ';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//get the default connection
// Mongoose provides a default connection object that you can use to interact with the database.
const db = mongoose.connection;

//define event listeners for the database connection
db.on("connected", () => {
    console.log("Mongoose connected to the database");
});
db.on("error", (err) => {
    console.error("Mongoose connection error:", err);
}); 
db.on("disconnected", () => {
    console.log("Mongoose disconnected from the database");
});

//Export the database connection
module.exports = db;

// Export the Mongoose connection object
module.exports.User = require('./models/user'); // Export the Person model