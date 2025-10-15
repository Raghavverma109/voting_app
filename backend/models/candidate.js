const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

//defining the user schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 25
    },
    image: {
        type: String, // URL or base64 string
        default: ''
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,   // id which is created by mongoose at the time of creating a new user
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],

    voteCount: {
        type: Number,
        default: 0
    },
    image: { type: String },         // Cloudinary URL
    imagePublicId: { type: String }, // Cloudinary public_id for deletion
});


const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;