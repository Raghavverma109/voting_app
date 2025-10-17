const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt'); // Import the JWT middleware and token generation function


// Import the USER model from the models directory
const User = require('../models/user');
const { use } = require('passport');

// in backend/routes/userRoutes.js

router.post('/signup', async (req, res) => {
    try {
        // ✅ FIX: Expect the nested objects directly from req.body
        const {
            name, age, email, password, phone,
            address, // <-- Expect the 'address' object
            sex,
            relative, // <-- Expect the 'relative' object
            addharCardNumber, role, profilePhoto, dob
        } = req.body;

        // --- Your existing validation checks (admin, aadhar, etc.) ---
        const adminUser = await User.findOne({ role: 'admin' });
        if (role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }
        // ... other validation checks ...

        // ✅ FIX: Pass the objects directly to the User constructor
        const newUser = new User({
            name,
            age,
            email,
            password,
            phone,
            address, // <-- Pass the whole address object
            sex,
            relative, // <-- Pass the whole relative object
            addharCardNumber,
            role,
            profilePhoto,
            dob
        });

        const savedUser = await newUser.save();

        const payload = {
            id: savedUser.id,
            role: savedUser.role
        };
        const token = generateToken(payload);

        res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
            token: token
        });
    } catch (err) {
        console.error('Error creating User:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
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



// router.post('/login', async (req, res) => {
//     const { addharCardNumber, password } = req.body;
//     try {
//         // --- ADD THIS LOG ---
//         console.log('--- Login Attempt ---');
//         console.log('Aadhar received from Postman:', addharCardNumber);

//         const user = await User.findOne({ addharCardNumber: addharCardNumber });

//         // --- ADD THIS LOG ---
//         console.log('User found in database:', user); // This will be null if not found

//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(401).json({ error: 'Invalid Aadhar number or password' }); // Changed to 401
//         }
        
//         //generate JWT token
//         const payload = {
//             id: user.id,
//             role: user.role // Make sure to add the role for admin checks!
//         };
//         const token = generateToken(payload);
//         res.status(200).json({ token });
//     } catch (err) {
//         console.error('Error during login:', err);
//         res.status(500).json({ error: 'Failed to login' });
//     }
// });

router.post('/login', async (req, res) => {
    const { addharCardNumber, password } = req.body;
    try {
        const user = await User.findOne({ addharCardNumber: addharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhar number or password' });
        }
        
        const payload = {
            id: user.id,
            role: user.role
        };
        const token = generateToken(payload);
        
        // ✅ IMPROVEMENT: Send back both the token and the user object
        res.status(200).json({ token, user: user });

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
