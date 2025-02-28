import express from 'express';
import { body } from 'express-validator';
import { 
    register, 
    login, 
    verifyEmail, 
    forgotPassword, 
    resetPassword,
    getProfile 
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Registration validation
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
    body('fullName').trim().notEmpty(),
    body('location').trim().notEmpty()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], login);

router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', [body('email').isEmail()], forgotPassword);
router.post('/reset-password/:token', [
    body('password').isLength({ min: 8 })
], resetPassword);

router.get('/profile', authenticate, getProfile);

export default router;