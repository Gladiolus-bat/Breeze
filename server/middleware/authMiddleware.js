import User from "../models/User.js";

// middleware to check if the user is authenticated
export const protect = async (req, res, next) => {
    // Implementation for authentication check
    const {userId} = req.auth;
    if(!userId) {
        res.json({success: false, message: " not authenticated"});
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}