import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/db';
import { ApiError } from '../utils/ApiError';

export const createDonation = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation error');
        }

        const { campaignId, amount, anonymous = false, message } = req.body;
        const userId = req.user?.id;

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if campaign exists and is active
            const campaignResult = await client.query(
                'SELECT * FROM campaigns WHERE id = $1 AND status = $2',
                [campaignId, 'active']
            );

            if (campaignResult.rows.length === 0) {
                throw new ApiError(404, 'Campaign not found or inactive');
            }

            // Create donation record
            const donationResult = await client.query(
                `INSERT INTO donations 
                (campaign_id, user_id, amount, payment_status, anonymous, message) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id, amount, created_at`,
                [campaignId, userId, amount, 'completed', anonymous, message]
            );

            // Update campaign current amount
            await client.query(
                'UPDATE campaigns SET current_amount = current_amount + $1 WHERE id = $2',
                [amount, campaignId]
            );

            await client.query('COMMIT');

            res.status(201).json({
                message: 'Donation successful',
                donation: donationResult.rows[0]
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

export const getDonationsByUser = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }

        const result = await pool.query(
            `SELECT d.*, c.title as campaign_title 
            FROM donations d 
            JOIN campaigns c ON d.campaign_id = c.id 
            WHERE d.user_id = $1 
            ORDER BY d.created_at DESC`,
            [req.user.id]
        );

        res.json({
            donations: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const getDonationsByCampaign = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { campaignId } = req.params;

        const result = await pool.query(
            `SELECT d.id, d.amount, d.anonymous, d.message, d.created_at,
            CASE WHEN d.anonymous THEN 'Anonymous' ELSE u.full_name END as donor_name
            FROM donations d
            LEFT JOIN users u ON d.user_id = u.id
            WHERE d.campaign_id = $1
            ORDER BY d.created_at DESC`,
            [campaignId]
        );

        res.json({
            donations: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const createHoneyMatch = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation error');
        }

        const { campaignId, matchAmount, matchDeadline } = req.body;
        const userId = req.user?.id;

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if campaign exists and is active
            const campaignResult = await client.query(
                'SELECT * FROM campaigns WHERE id = $1 AND status = $2',
                [campaignId, 'active']
            );

            if (campaignResult.rows.length === 0) {
                throw new ApiError(404, 'Campaign not found or inactive');
            }

            // Create honey match record
            const matchResult = await client.query(
                `INSERT INTO honey_matches 
                (campaign_id, matcher_id, match_amount, match_deadline, status) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, match_amount, match_deadline`,
                [campaignId, userId, matchAmount, matchDeadline, 'active']
            );

            await client.query('COMMIT');

            res.status(201).json({
                message: 'Honey match created successfully',
                match: matchResult.rows[0]
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

export const getLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { timeframe = 'all-time', category } = req.query;

        let timeFilter = '';
        switch (timeframe) {
            case 'daily':
                timeFilter = 'AND d.created_at >= CURRENT_DATE';
                break;
            case 'weekly':
                timeFilter = 'AND d.created_at >= CURRENT_DATE - INTERVAL \'7 days\'';
                break;
            case 'monthly':
                timeFilter = 'AND d.created_at >= CURRENT_DATE - INTERVAL \'30 days\'';
                break;
            default:
                timeFilter = '';
        }

        let categoryFilter = category ? 'AND c.category = $1' : '';
        const params = category ? [category] : [];

        const query = `
            SELECT 
                CASE 
                    WHEN d.anonymous THEN 'Anonymous'
                    ELSE u.full_name 
                END as donor_name,
                SUM(d.amount) as total_donated,
                COUNT(d.id) as donation_count
            FROM donations d
            LEFT JOIN users u ON d.user_id = u.id
            JOIN campaigns c ON d.campaign_id = c.id
            WHERE 1=1 
            ${timeFilter}
            ${categoryFilter}
            GROUP BY 
                CASE 
                    WHEN d.anonymous THEN 'Anonymous'
                    ELSE u.full_name 
                END
            ORDER BY total_donated DESC
            LIMIT 10
        `;

        const result = await pool.query(query, params);

        res.json({
            timeframe,
            category: category || 'all',
            leaderboard: result.rows
        });
    } catch (error) {
        next(error);
    }
}; 