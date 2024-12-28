import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization required", success: false });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing", success: false });
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user ID in req.user (or fetch full user data if needed)
        req.user = decoded.id;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        res.status(401).json({ message: "Unauthorized access", success: false });
    }
};

export default authUser;