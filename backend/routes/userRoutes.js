const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt'); // Import the JWT middleware and token generation function


// Import the USER model from the models directory
const User = require('../models/user');
const { use } = require('passport');

// POST method to create a new user - SIGNUP

router.post('/signup', async (req, res) => {
  console.log("INCOMING HEADERS:", req.headers);
  try {
    const data = req.body;
    console.log('Received data for new User:', data);

    // ✅ Ensure only one admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (data.role === 'admin' && adminUser) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // ✅ Validate Aadhaar
    if (!/^\d{12}$/.test(data.addharCardNumber)) {
      return res.status(400).json({ error: 'Aadhar number must be exactly 12 digits' });
    }

    // ✅ Check duplicates by Aadhaar
    const existingUser = await User.findOne({ addharCardNumber: data.addharCardNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this Aadhar number already exists' });
    }

    // ✅ Handle optional email (null allowed)
    let email = null;
    if (data.email && data.email.trim() !== "") {
      const existingEmailUser = await User.findOne({ email: data.email.trim() });
      if (existingEmailUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      email = data.email.trim();
    }

    // ✅ Create new user
    const newUser = new User({
      ...req.body,
      email: email, // null if not provided
      profilePhoto: req.body.profilePhoto, // Cloudinary URL
    });

    const savedUser = await newUser.save();

    // ✅ Generate JWT token
    const payload = { id: savedUser.id };
    const token = generateToken(payload);

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


// // LOGIN method to authenticate a person

// router.post('/login', async (req, res) => {
//   const { addharCardNumber, password } = req.body; // Extract username and password from request body
//   try {
//     const user = await User.findOne({ addharCardNumber: addharCardNumber }); // Find person by username
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(404).json({ error: 'Invalid username or password' }); // If person not found, return 404
//     }
//     //generate JWT token
//     const payload = {
//       id: user.id,
//     };
//     const token = generateToken(payload); // Generate JWT token
//     res.status(200).json({ token });// Send the token as a JSON response})  
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ error: 'Failed to login' }); // If an error occurs, return 500
//   }
// });



router.post('/login', async (req, res) => {
    const { addharCardNumber, password } = req.body;
    try {
        // --- ADD THIS LOG ---
        console.log('--- Login Attempt ---');
        console.log('Aadhar received from Postman:', addharCardNumber);

        const user = await User.findOne({ addharCardNumber: addharCardNumber });

        // --- ADD THIS LOG ---
        console.log('User found in database:', user); // This will be null if not found

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhar number or password' }); // Changed to 401
        }
        
        //generate JWT token
        const payload = {
            id: user.id,
            role: user.role // Make sure to add the role for admin checks!
        };
        const token = generateToken(payload);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Profile route to get the authenticated user's profile

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    // Get the authenticated user's ID from the request object
    const userId = req.user.id;
    const user = await User.findById(userId); // Find the user by ID in the database
    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // If user not found, return 404
    }
    res.status(200).json(user); // Send the user data as a JSON response
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' }); // If an error occurs, return 500
  }
});

/// PUT method to update a user's password

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  const userId = req.user.id; // get the user ID from the token
  const { currentPassword, newPassword } = req.body;

  try {
    console.log('Updating password for user ID:', userId);

    // Find the User by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check old password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Set the new password → pre('save') will hash it
    user.password = newPassword;

    // Save user (this triggers pre-save hashing)
    await user.save();

    console.log('Password updated successfully');
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
