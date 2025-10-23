const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require('../JWT');
const Election = require("../models/election");

const mongoose = require('mongoose');

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
// Add this at the top of your electionRoutes.js file
const User = require('../models/user');

// ... your other routes ...

router.post('/:electionId/vote', jwtAuthMiddleware, async (req, res) => {
    const { electionId } = req.params;
    const { candidateId } = req.body;
    
    // Get user details from the verified token
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // --- CHECK 1: Block Admins ---
        if (userRole === 'admin') {
            return res.status(403).json({ message: 'Admins are not allowed to vote.' });
        }

        // --- CHECK 2: Verify Voter's Age (New) ---
        const voter = await User.findById(userId);
        if (!voter || !voter.dob  || !voter.address || !voter.address.state) {
            return res.status(404).json({ message: 'Voter address information is incomplete.' });
        }

        const voterState = voter.address.state;
        
        const today = new Date();
        const birthDate = new Date(voter.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if the user's birthday hasn't occurred yet this year
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return res.status(403).json({ message: 'Forbidden: Voters must be at least 18 years old.' });
        }

        // --- CHECK 3: Prevent Multiple Votes ---
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

        // --- Cast the Vote ---
        const updateResult = await Election.updateOne(
            { "_id": electionId, "parties.candidate": candidateId },
            { 
                "$inc": { "parties.$.voteCount": 1 },
                "$push": { "parties.$.votes": { user: userId, voterState: voterState } }
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


// GET /elections/:electionId/audit
// Fetches a single election's details and a list of all voters who participated.
router.get('/:electionId/audit', jwtAuthMiddleware, adminCheck, async (req, res) => {
    console.log("fetch the req body for audit:", req.params.electionId);

    try {
        const election = await Election.findById(req.params.electionId)
            .populate('parties.candidate', 'name party image') // Populate candidate details
            // New line
            .populate('parties.votes.user', 'name addharCardNumber profilePhoto dob address isVerified sex relative');

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }


        // Create a flat, unique list of voters from all parties in the election
        const votersMap = new Map();
        election.parties.forEach(party => {
            party.votes.forEach(vote => {
                if (vote.user && !votersMap.has(vote.user._id.toString())) {
                    votersMap.set(vote.user._id.toString(), vote.user);
                }
            });
        });

        const voters = Array.from(votersMap.values());

        const auditData = {
            _id: election._id,
            title: election.title,
            dateOfElection: election.dateOfElection,
            totalVotes: voters.length,
            participants: election.parties.map(p => ({
                name: p.candidate.name,
                party: p.candidate.party,
                voteCount: p.voteCount,
            })),
            voters: voters, // The list of users who voted
        };

        res.status(200).json(auditData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single election by its ID
router.get('/:electionId', async (req, res) => {
    try {
        const election = await Election.findById(req.params.electionId)
            .populate({
                path: 'parties.candidate',
                select: 'name image party' // Populate candidate details
            });

        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }
        res.status(200).json(election);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// in backend/routes/electionRoutes.js

router.get('/:electionId/map-results', async (req, res) => {
    try {
        const electionId = new mongoose.Types.ObjectId(req.params.electionId);

        const resultsByState = await Election.aggregate([
            { $match: { _id: electionId } },
            { $unwind: '$parties' },
            { $unwind: { path: '$parties.votes', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'candidates', localField: 'parties.candidate', foreignField: '_id', as: 'candidateInfo' } },
            { $unwind: { path: '$candidateInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    // ✅ FIX: Use $ifNull to prevent crashing on missing data
                    _id: {
                        state: { $ifNull: ['$parties.votes.voterState', 'Unknown'] },
                        party: { $ifNull: ['$candidateInfo.party', 'Unknown'] }
                    },
                    votes: { $sum: { $cond: [{ $ifNull: ['$parties.votes.user', false] }, 1, 0] } }
                }
            },
            // Filter out any results where the state or party was unknown
            { $match: { '_id.state': { $ne: 'Unknown' }, '_id.party': { $ne: 'Unknown' } } },
            {
                $group: {
                    _id: '$_id.state',
                    results: { $push: { party: '$_id.party', votes: '$votes' } },
                    totalVotes: { $sum: '$votes' }
                }
            },
            {
                $addFields: {
                    winningParty: {
                        $reduce: {
                            input: '$results',
                            initialValue: { votes: -1, party: 'N/A' },
                            in: { $cond: [{ $gt: ['$$this.votes', '$$value.votes'] }, '$$this', '$$value'] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: '$_id',
                    totalVotes: 1,
                    results: 1,
                    winningParty: '$winningParty.party'
                }
            }
        ]);

        res.json(resultsByState);
    } catch (err) {
        console.error("Error in /map-results aggregation:", err); 
        res.status(500).json({ error: 'Failed to aggregate map results.', details: err.message });
    }
});