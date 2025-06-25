const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware , generateToken} = require('./../JWT'); // Import the JWT middleware and token generation function


// Import the USER model from the models directory
const User = require('../models/user'); 
const { use } = require('passport');

// POST method to create a new user - SIGNUP

router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming data is in the request body

        const newUser = new User(data); // Create a new user document using mongoose model

        const savedUser = await newUser.save(); // Save to DB

        const payload = {
            id : savedUser.id,
        }

        const token = generateToken(payload); // Generate JWT token

        console.log('Token is:', token);

        res.status(201).json({
            message: 'User created successfully',
            person: savedUser,
            token: token
        });
    } catch (err) {
        console.error('Error creating User:', err);
        res.status(500).json({ error: 'Failed to create User' });
    }
});

// LOGIN method to authenticate a person
router.post('/login', async (req, res) => {
    const { addharCardNumber, password } = req.body; // Extract username and password from request body
    try {       
        const user = await User.findOne({ addharCardNumber: addharCardNumber }); // Find person by username
        if (!user || !(await user.comparePassword(password)))  {          
            return res.status(404).json({ error: 'Invalid username or password' }); // If person not found, return 404
        }   
        //generate JWT token
        const payload = {
            id: user.id,    
        };
        const token = generateToken(payload); // Generate JWT token
        res.status(200).json({ token });// Send the token as a JSON response})  
    }catch(err){
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to login' }); // If an error occurs, return 500
    }
});
// Profile route to get the authenticated user's profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.userData.id; // Get the authenticated user's ID from the request object
        const user = await User.findById(userId); // Find the user by ID in the database
        if(!user){
            return res.status(404).json({ error: 'User not found' }); // If user not found, return 404
        }
        res.status(200).json(user); // Send the user data as a JSON response
    } catch (err) { 
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to fetch user profile' }); // If an error occurs, return 500
    }
});

// PUT method to update a person's data
router.put('/profile/password', jwtAuthMiddleware ,async (req ,res)=>{
    const userId = req.user.id; // get the person ID from the token
    const {currentPassword , newPassword} = req.body; // get the updated data from the request body
    try{
        // Find the User by ID
        const user = await User.findById(userId); // Find the user by ID in the database

        // If password does not match 
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Current password is incorrect' }); // if password does not match, return 401
        }

        // Update the password
        user.password = newPassword; // Set the new password    
        console.log('Password updated successfully');
        res.status(200).json({ message: 'Password updated successfully' }); // return success message
    }
    catch(error){ 
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Failed to update person' });
    }
})



// Export the router to use in the main server file
module.exports = router;
// This router can be used in the main server file to handle requests related to persons.