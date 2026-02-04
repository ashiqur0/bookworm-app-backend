import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
}

router.post('/register', async(req, res) => {
    try {
        const {username, email, password, profileImage} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'username must be at least 3 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // get random avatar image
        const randomProfileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        
        // Create new user
        const user = new User({
            username,
            email,
            password, // In a real application, make sure to hash the password before saving
            profileImage: profileImage || randomProfileImage
        });

        await user.save();                      // Save user to database
        const token = generateToken(user._id);  // Generate JWT token

        res.status(201).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async(req, res) => {
    res.send('Login route');
});

export default router;