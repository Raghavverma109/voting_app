const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('../JWT'); // Import the JWT middleware and token generation function
const multer = require("multer");
const fs = require("fs");
const cloudinary = require('../cloudinary');


const upload = multer({ dest: "uploads/" });


// Import the USER model from the models directory
const User = require('../models/user');
const { use } = require('passport');
const Candidate = require('../models/candidate');

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        return user.role === 'admin';
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false; // If an error occurs, assume the user is not an admin
    }
};

// POST method to create a new candidate

router.post('/', upload.single("image"), jwtAuthMiddleware,async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
          return res.status(403).json({ error: 'Forbidden: You do not have permission to create a candidate' });
        }

        const { name, party } = req.body;
        if (!name || !party) return res.status(400).json({ error: 'Name and Party are required' });

        let imageUrl = null;
        let publicId = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'voting_app/candidates',
            });
            imageUrl = result.secure_url;
            publicId = result.public_id;

            fs.unlinkSync(req.file.path);
        }

        const newCandidate = new Candidate({
            name,
            party,
            image: imageUrl || undefined,
            imagePublicId: publicId || undefined,
        });

        const savedCandidate = await newCandidate.save();
        res.status(201).json({ savedCandidate });
    } catch (err) {
        console.error('Error creating candidate:', err);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});


// PUT method to update a candidate's data

router.put('/:candidateId', upload.single("image"), jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res
                .status(403)
                .json({ error: 'Forbidden: You do not have permission to update a candidate' });
        }

        const candidateId = req.params.candidateId;
        const updatedData = req.body;

        let candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (candidate.imagePublicId) {
                await cloudinary.uploader.destroy(candidate.imagePublicId);
            }
            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'voting_app/candidates',
            });
            updatedData.image = result.secure_url;
            updatedData.imagePublicId = result.public_id;
            fs.unlinkSync(req.file.path);
        }

        // Update candidate
        const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, updatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ candidate: updatedCandidate });
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    }
});

// DELETE method to remove a candidate

router.delete('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res
                .status(403)
                .json({ error: 'Forbidden: You do not have permission to delete a candidate' });
        }

        const candidateId = req.params.candidateId;

        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
});

//let's vote for a candidate

router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
    const candidateId = req.params.candidateId; // get the candidate ID from the request parameters
    const userId = req.user.id;  // get the user ID from the JWT token

    try {
        const candidate = await Candidate.findById(candidateId); // Find the candidate by ID

        // Find the candidate and update their vote count  
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' }); // If candidate not found, return 404
        }
        // Check if the user has already voted
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isVoted) {
            return res.status(403).json({ error: 'You have already voted' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Admins cannot vote' });
        }

        // Update the candidate's vote count and add the user to the votes array
        candidate.votes.push({ user: userId }); // Add the user to the votes array
        candidate.voteCount += 1; // Increment the vote count

        await candidate.save(); // Save the updated candidate

        // Udate the user to mark them as having voted
        user.isVoted = true;
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Vote cast successfully', candidate }); // Return success message and updated candidate

    } catch (error) {
        console.error('Error voting for candidate:', error);
        return res.status(500).json({ error: 'Failed to vote for candidate' });
    }
});

// vote count 

router.get('/vote/count', async (req, res) => {
    try {
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data) => {
            return {
                name: data.name,
                _id: data._id,
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party votes image imagePublicId');
        // Fetch all candidates from the database
        res.status(200).json(candidates); // Return the list of candidates as a JSON response
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});


module.exports = router;

