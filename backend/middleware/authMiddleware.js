const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify Token
            // MUST match the secret used in authController.js
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

            // 3. Attach user info to the request object
            // Payload from authController is: { id, role, refId }
            req.user = decoded; 

            next(); // Move to the actual controller
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};