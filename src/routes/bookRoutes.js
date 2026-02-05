import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectedRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectedRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!image || !title || !rating || !caption) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            imageUrl,
            user: req.user._id
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all books
// pagination => infinite scroll
router.get('/', protectedRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'username profileImage'); // Populate user details

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        res.send({
            books,
            totalBooks,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;