import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';

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
            imageUrl
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;