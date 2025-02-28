import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/db';
import { ApiError } from '../utils/ApiError';

export const createCampaign = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation error');
        }

        const { title, description, category, goalAmount, deadline, beneficiaryType } = req.body;
        const userId = req.user?.id;

        const result = await pool.query(
            `INSERT INTO campaigns 
            (user_id, title, description, category, goal_amount, deadline, beneficiary_type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [userId, title, description, category, goalAmount, deadline, beneficiaryType]
        );

        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getCampaigns = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category, status = 'active' } = req.query;
        const queryParams: any[] = [status];
        let queryStr = 'SELECT * FROM campaigns WHERE status = $1';

        if (category) {
            queryStr += ' AND category = $2';
            queryParams.push(category);
        }

        queryStr += ' ORDER BY created_at DESC';

        const result = await pool.query(queryStr, queryParams);

        res.json({
            campaigns: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const getCampaignById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM campaigns WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            throw new ApiError(404, 'Campaign not found');
        }

        res.json({
            campaign: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const updateCampaign = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { title, description, category, goalAmount, deadline, status } = req.body;
        const userId = req.user?.id;

        // Check if campaign exists and belongs to user
        const campaignCheck = await pool.query(
            'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (campaignCheck.rows.length === 0) {
            throw new ApiError(404, 'Campaign not found or unauthorized');
        }

        const result = await pool.query(
            `UPDATE campaigns 
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                category = COALESCE($3, category),
                goal_amount = COALESCE($4, goal_amount),
                deadline = COALESCE($5, deadline),
                status = COALESCE($6, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7 AND user_id = $8
            RETURNING *`,
            [title, description, category, goalAmount, deadline, status, id, userId]
        );

        res.json({
            message: 'Campaign updated successfully',
            campaign: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCampaign = async (
    req: Request & { user?: { id: number } },
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const result = await pool.query(
            'DELETE FROM campaigns WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            throw new ApiError(404, 'Campaign not found or unauthorized');
        }

        res.json({
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}; 