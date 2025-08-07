import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request for later use

        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
