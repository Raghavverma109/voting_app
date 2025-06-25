const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware , generateToken} = require('../JWT'); // Import the JWT middleware and token generation function


// Import the USER model from the models directory
const User = require('../models/user'); 
const { use } = require('passport');
const Candidate = require('../models/candidate'); // Import the Candidate model

const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId); 
        console.log('Checking admin role for user:', user);
        return user.role === 'admin';
    }catch (error) {
        console.error('Error checking admin role:', error);
        return false; // If an error occurs, assume the user is not an admin
    }
};

// POST method to create a new candidate 

router.post('/',jwtAuthMiddleware, async (req, res) => {
    try {
        console.log("role is :", req.user.userData.id);
        // Check if the user has admin role
        if(!await checkAdminRole(req.user.userData.id)){
            return res.status(403).json({ error: 'Forbidden: You do not have permission to create a candidate' });
        }

        const data = req.body; // Assuming data is in the request body

        const newCandidate = new Candidate(data); // Create a new user document using mongoose model

        const savedCandidate = await newCandidate.save(); // Save to DB

        res.status(201).json({savedCandidate}); // Return the saved candidate as a JSON response
    } catch (err) {
        console.error('Error creating candidate:', err);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
});


// // PUT method to update a candidate's data
router.put('/:candidateId' , jwtAuthMiddleware,async (req ,res)=>{
    if(! await checkAdminRole(req.user.userData.id)){
            return res.status(403).json({ error: 'Forbidden: You do not have permission to create a candidate' });
        }
    const candidateId = req.params.id; // get the candidate ID from the request parameters
    const updatedData = req.body; // get the updated data from the request body
    try{
        const updatedCandidate = await Person.findByIdAndUpdate(candidateId, updatedData ,{
            new: true, // return the updated document
            runValidators: true , // validate the updated data against the schema
            
        })
        console.log('Candidate updated successfully:', updatedCandidate);

        if (!updatedCandidate) {
            return res.status(404).json({ error: 'candidate not found' }); // if person not found, return 404
        }
    }
    catch(error){
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    };
});

// Delete method to remove a candidate
router.delete('/:candidateId' , jwtAuthMiddleware, async (req ,res)=>{
    if(! await checkAdminRole(req.user.userData.id)){
            return res.status(403).json({ error: 'Forbidden: You do not have permission to create a candidate' });
        }
    const candidateId = req.params.candidateId; // get the candidate ID from the request parameters
    try{
        const deletedCandidate  = await Candidate.findByIdAndDelete(candidateId); // delete the person by ID
        if(!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' }); // if person not found, return 404
        }
        console.log('Candidate deleted successfully:', deletedCandidate);
        res.status(200).json({ message: 'Candidate deleted successfully' }); // return success message
    }
    catch(error){
        console.error('Error updating candidate:', error);
        res.status(500).json({ error: 'Failed to update candidate' });
    };
});

//let's vote for a candidate
router.post('/vote/:candidateId', jwtAuthMiddleware , async (req, res) => {
    const candidateId = req.params.candidateId; // get the candidate ID from the request parameters
    const userId = req.user.id;  // get the user ID from the JWT token
    console.log('User ID:', userId);

    try {
        const candidate = await Candidate.findById(candidateId); // Find the candidate by ID

        // Find the candidate and update their vote count  
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' }); // If candidate not found, return 404
        }
        // Check if the user has already voted
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }   
        if (user.isVoted) {
            return res.status(403).json({ error: 'You have already voted' });
        }
        if(user.role === 'admin') {
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
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// GET method to retrieve list of all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party -_id') // Fetch all candidates from the database
        res.status(200).json(candidates); // Return the list of candidates as a JSON response
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});

// Export the router to use in the main server file
module.exports = router;
//This router can be used in the main server file to handle requests related to candidates.

