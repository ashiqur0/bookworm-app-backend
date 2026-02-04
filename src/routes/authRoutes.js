import express from 'express';

const router = express.Router();

router.get('/register', async(req, res) => {
    res.send('Register route');
});

export default router;