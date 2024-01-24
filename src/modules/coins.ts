import { Request, Response } from 'express';
import { Coin } from '../models/coinsModel';

export const addValidCoin = async (req: Request, res: Response) => {
    try {
        const { symbol } = req.body;

        if (!symbol) {
            return res.status(400).json({
                message: 'Invalid coin symbol',
                success: false,
            });
        }

        const existingCoin = await Coin.findOne({ symbol });

        if (existingCoin) {
            return res.status(409).json({
                message: 'Coin symbol already exists',
                success: false,
            });
        }

        const newCoin = await Coin.create({ symbol });

        return res.status(201).json({
            message: `Coin symbol ${newCoin} added`,
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to add coin',
            success: false,
        });
    }
};

export const getValidCoins = async (res: Response) => {
    try {
        const validCoins = await Coin.find({});
        if (!validCoins || validCoins.length === 0) {
            return res.status(404).json({
                message: 'Valid coins not found',
                success: false,
            });
        }

        return res.status(200).json({
            ...validCoins,
            message: `Valid coins found`,
            success: true,
            count: validCoins.length,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to find valid coins',
            success: false,
        });
    }
};
