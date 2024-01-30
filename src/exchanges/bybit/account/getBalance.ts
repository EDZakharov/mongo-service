import { Request, Response } from 'express';
import { bybit } from '../bybit';

interface IGetWalletQuery {
    symbol?: string;
    id?: string;
}

export const getWalletBalanceSpot = async (req: Request, res: Response) => {
    const { symbol, id }: IGetWalletQuery = req.query;

    if (!symbol) {
        return res.status(400).json({
            message: 'Bad symbol',
            success: false,
        });
    }

    if (!id || id.length !== 24) {
        return res.status(400).json({
            message: 'Id must be 24 hex string',
            status: false,
        });
    }

    try {
        const result = await bybit.getCoinBalance({
            coin: symbol,
            accountType: 'UNIFIED',
        });

        if (result && !result.result.balance) {
            throw new Error();
        }

        return res.status(200).json({
            ...result,
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get wallet balance',
            success: false,
        });
    }
};
