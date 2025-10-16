const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require('./../jwt');
const Election = require("../models/election");

// A simple admin-check middleware
const adminCheck = (req, res, next) => {
    // Assumes the user role is part of the JWT payload
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

// =================================================================
//  ADMIN-ONLY ROUTES
// =================================================================

// POST /elections/add (Admin Only)
router.post('/add', jwtAuthMiddleware, adminCheck, async (req, res) => {
    const { title, dateOfElection, parties: candidateIds } = req.body;
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
        return res.status(400).json({ error: "candidateIds must be a non-empty array." });
    }
    try {
        const parties = candidateIds.map(id => ({ candidate: id, voteCount: 0, votes: [] }));
        const newElection = new Election({ title, dateOfElection, parties });
        await newElection.save();
        res.status(201).json(newElection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /elections/:electionId (Admin Only)
router.patch('/:electionId', jwtAuthMiddleware, adminCheck, async (req, res) => {
    try {
        const updatedElection = await Election.findByIdAndUpdate(
            req.params.electionId,
            { $set: req.body }, // Use $set for better security
            { new: true, runValidators: true }
        );
        if (!updatedElection) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json(updatedElection);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /elections/:electionId (Admin Only)
router.delete('/:electionId', jwtAuthMiddleware, adminCheck, async (req, res) => {
    try {
        const deletedElection = await Election.findByIdAndDelete(req.params.electionId);
        if (!deletedElection) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json({ message: 'Election deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =================================================================
//  PUBLIC & USER ROUTES
// =================================================================

// GET /elections
router.get('/', async (req, res) => {
    try {
        // Simplified query using select for cleaner projection
        const elections = await Election.find().sort({ dateOfElection: -1 }).populate({
            path: 'parties.candidate',
            select: 'name image party' // Select only the fields you need
        });
        res.json(elections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /elections/:electionId/vote (SECURED & ATOMIC)
router.post('/:electionId/vote', jwtAuthMiddleware, async (req, res) => {
    const { electionId } = req.params;
    const { candidateId } = req.body; // Only need candidateId from body
    const userId = req.user.id; // Get user ID from the verified token

    try {
        // 1. Check if the user has already voted in this election
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        
        const hasVoted = election.parties.some(party => 
            party.votes.some(vote => vote.user.toString() === userId)
        );
        
        if (hasVoted) {
            return res.status(400).json({ message: "You have already cast your vote in this election." });
        }

        // 2. Atomically update the vote count and add the user's vote
        const updateResult = await Election.updateOne(
            { "_id": electionId, "parties.candidate": candidateId },
            { 
                "$inc": { "parties.$.voteCount": 1 }, // Increment the voteCount
                "$push": { "parties.$.votes": { user: userId } } // Add user to the votes array
            }
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({ message: "Candidate not found in this election." });
        }

        res.json({ message: 'Vote counted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /elections/current (Finds an election happening TODAY)
router.get("/current", async (_, res) => {
    try {
        const today = new Date();
        // Set to the beginning of the day
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        // Set to the end of the day
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const currentElection = await Election.findOne({
            dateOfElection: {
                $gte: startOfDay, // Greater than or equal to the start of today
                $lt: endOfDay      // Less than the end of today
            }
        }).populate({
            path: 'parties.candidate',
            select: 'name image party'
        });

        // It's okay to return null if no election is found
        res.status(200).json(currentElection);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /elections/results (with tie handling)
router.get('/results', async (req, res) => {
    try {
        const today = new Date();
        const completedElections = await Election.find({ dateOfElection: { $lt: today } })
            .populate('parties.candidate', 'name party');

        if (!completedElections || completedElections.length === 0) {
            return res.status(200).json([]);
        }

        const results = completedElections.map(election => {
            if (election.parties.length === 0) {
                return { electionId: election._id, title: election.title, result: "No candidates participated." };
            }

            const sortedParties = [...election.parties].sort((a, b) => b.voteCount - a.voteCount);
            const winner = sortedParties[0];
            const totalVotes = election.parties.reduce((sum, party) => sum + party.voteCount, 0);

            // Check for a tie
            const isTie = sortedParties.length > 1 && sortedParties[1].voteCount === winner.voteCount;

            return {
                electionId: election._id,
                title: election.title,
                dateOfElection: election.dateOfElection,
                totalVotesCasted: totalVotes,
                result: isTie ? "Tie" : "Winner Declared",
                winner: isTie ? 
                    sortedParties.filter(p => p.voteCount === winner.voteCount).map(w => ({ name: w.candidate.name, votes: w.voteCount })) :
                    { name: winner.candidate.name, party: winner.candidate.party, votes: winner.voteCount },
                participants: sortedParties.map(p => ({
                    name: p.candidate.name,
                    party: p.candidate.party,
                    voteCount: p.voteCount,
                }))
            };
        });

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;