import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import {
    createCampaign,
    getCampaignById,
    updateCampaign,
    getCampaigns,
    deleteCampaign
} from '../controllers/campaign.controller';

const router = express.Router();

// Campaign validation
const campaignValidation = [
    body('title').trim().isLength({ min: 5, max: 100 }),
    body('description').trim().isLength({ min: 20 }),
    body('category').isIn(['medical', 'education', 'community', 'emergency', 'creative', 'nonprofit']),
    body('goalAmount').isFloat({ min: 100 }),
    body('deadline').isISO8601(),
    body('beneficiaryType').isIn(['self', 'someone_else', 'charity'])
];

// Routes
router.post('/', authenticate, campaignValidation, createCampaign);
router.get('/:id', getCampaignById);
router.put('/:id', authenticate, campaignValidation, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

// List campaigns with filters
router.get('/', [
    body('category').optional().isString(),
    body('status').optional().isIn(['active', 'completed', 'cancelled'])
], getCampaigns);

export default router; 