const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and well-formed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to the request object
        // req.user = decoded;
        req.user = decoded; // Assuming userData contains the necessary user information
        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};


// Function to generate a JWT token
// const generateToken = (userData) => {
//     // Create a token with user information and expiration time
//     // return jwt.sign({userData} , process.env.JWT_SECRET);

//     const secret = process.env.JWT_SECRET;

//     if (!secret) {
//         throw new Error('JWT_SECRET is not defined in environment variables.');
//     }

//     return jwt.sign(userData, 
//         process.env.JWT_SECRET, 
//         {expiresIn: 30000}  // Token expiration time 
//     );

// };  

const generateToken = (userData) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign(userData, secret, {
        expiresIn: '1d' // or '1h', '2d' etc.
    });
};

module.exports = {jwtAuthMiddleware , generateToken};