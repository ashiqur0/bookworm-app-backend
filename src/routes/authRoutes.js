import express from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/register', async(req, res) => {
    try {
        const {userName, email, password, profileImage} = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (userName.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // get random avatar image
        const randomProfileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
        
        // Create new user
        const newUser = new User({
            userName,
            email,
            password, // In a real application, make sure to hash the password before saving
            profileImage: profileImage || randomProfileImage
        });
    } catch (error) {
        console.error(error);
    }
});

router.get('/login', async(req, res) => {
    res.send('Login route');
});

export default router;