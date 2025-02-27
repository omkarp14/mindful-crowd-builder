import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import {
    createCampaign,
    getCampaign,
    updateCampaign,
    listCampaigns,
    deleteCampaign,
    toggleHoneyMatch,
    joinSwarmFunding
} from '../controllers/campaign.controller';

const router = express.Router();

// Campaign validation
const campaignValidation = [
    body('title').trim().isLength({ min: 5, max: 100 }),
    body('description').trim().isLength({ min: 20 }),
    body('category').isIn(['medical', 'education', 'community', 'emergency', 'creative', 'nonprofit']),
    body('goalAmount').isFloat({ min: 100 }),
    body('deadline').isISO8601(),
    body('location').trim().notEmpty(),
    body('beneficiaryType').isIn(['self', 'someone_else', 'charity'])
];

// Routes
router.post('/', authenticate, campaignValidation, createCampaign);
router.get('/:id', getCampaign);
router.put('/:id', authenticate, campaignValidation, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

// HiveFund specific features
router.post('/:id/honey-match', authenticate, toggleHoneyMatch);
router.post('/:id/join-swarm', authenticate, joinSwarmFunding);

// List campaigns with filters
router.get('/', [
    body('category').optional().isString(),
    body('location').optional().isString(),
    body('sort').optional().isIn(['newest', 'trending', 'ending-soon']),
    body('page').optional().isInt({ min: 1 }),
    body('limit').optional().isInt({ min: 1, max: 50 })
], listCampaigns);

export default router; 