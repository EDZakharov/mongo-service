import { Request, Response } from 'express';
import { bybit } from '../bybit';

interface IGetWalletQuery {
    symbol?: string;
}

export const getFeeRateSpot = async (req: Request, res: Response) => {
    const { symbol }: IGetWalletQuery = req.query;

    if (!symbol) {
        return res.status(400).json({
            message: 'Bad symbol',
            success: false,
        });
    }
    try {
        const result = await bybit.getFeeRate({
            category: 'spot',
            symbol,
        });

        if (result && result.result.list.length === 0) {
            throw new Error();
        }

        return res.status(200).json({
            ...result,
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get fee rate',
            success: false,
        });
    }
};
