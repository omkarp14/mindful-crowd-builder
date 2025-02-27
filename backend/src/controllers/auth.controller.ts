import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { ApiError } from '../utils/ApiError';

// Helper function to generate JWT token
const generateToken = (user: { id: number; email: string; role: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation error');
        }

        const { email, password, fullName, location } = req.body;

        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            throw new ApiError(400, 'User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [email, hashedPassword, fullName, false]
        );

        const user = result.rows[0];
        const token = generateToken({ id: user.id, email: user.email, role: 'user' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation error');
        }

        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken({ id: user.id, email: user.email, role: 'user' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name
            }
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Update user verification status
        await pool.query(
            'UPDATE users SET is_verified = true WHERE id = $1',
            [decoded.id]
        );

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            // Don't reveal if user exists or not
            res.json({ message: 'If an account exists, a password reset link will be sent' });
            return;
        }

        const user = result.rows[0];
        const resetToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // In a real application, send email with reset token
        // For now, just return the token
        res.json({
            message: 'Password reset instructions sent',
            resetToken // Remove this in production
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [hashedPassword, decoded.id]
        );

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const result = await pool.query(
            'SELECT id, email, full_name, avatar_url, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            throw new ApiError(404, 'User not found');
        }

        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
}; 