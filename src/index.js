import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import job from './lib/cron.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT;

// job.start(); // Start the cron job to keep the server awake on Render
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Bookworm API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});