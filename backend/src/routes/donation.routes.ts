import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import {
    createDonation,
    getDonationsByUser,
    getDonationsByCampaign,
    createHoneyMatch,
    getLeaderboard
} from '../controllers/donation.controller';

const router = express.Router();

// Donation validation
const donationValidation = [
    body('amount').isFloat({ min: 1 }),
    body('campaignId').isInt(),
    body('anonymous').optional().isBoolean(),
    body('message').optional().trim().isLength({ max: 500 })
];

// Routes
router.post('/', authenticate, donationValidation, createDonation);
router.get('/user', authenticate, getDonationsByUser);
router.get('/campaign/:campaignId', getDonationsByCampaign);

// HiveFund specific features
router.post('/honey-match', authenticate, [
    body('campaignId').isInt(),
    body('matchAmount').isFloat({ min: 100 }),
    body('matchDeadline').isISO8601()
], createHoneyMatch);

// Leaderboard routes
router.get('/leaderboard', [
    body('timeframe').optional().isIn(['daily', 'weekly', 'monthly', 'all-time']),
    body('category').optional().isString()
], getLeaderboard);

export default router; 