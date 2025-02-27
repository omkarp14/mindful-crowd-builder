const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Validate input
        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING user_id, email, full_name',
            [email, passwordHash, fullName]
        );

        // Generate JWT
        const token = jwt.sign(
            { userId: newUser.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user: newUser.rows[0],
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            user: {
                userId: user.rows[0].user_id,
                email: user.rows[0].email,
                fullName: user.rows[0].full_name
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT user_id, email, full_name FROM users WHERE user_id = $1',
            [req.user.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;