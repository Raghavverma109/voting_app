const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dateOfElection: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    parties: [
        {
            candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
            voteCount: { type: Number, default: 0 },
            votes: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                    votedAt: { type: Date, default: Date.now },
                    voterState: { type: String, required: true }
                }
            ]
        }
    ]
});

const Election = mongoose.model('Election', electionSchema);
module.exports = Election;
