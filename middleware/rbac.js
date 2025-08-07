export const isAdmin = (req, res, next) => {
    try {
        // req.user is populated by your protectRoute middleware
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        next(); // proceed to route handler
    } catch (error) {
        console.error('RBAC error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
