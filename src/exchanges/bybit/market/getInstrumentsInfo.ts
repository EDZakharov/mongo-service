import { Request, Response } from 'express';
import { bybit } from '../bybit';

interface IGetInstrQuery {
    symbol?: string;
}

export const getInstrumentInfo = async (req: Request, res: Response) => {
    const { symbol }: IGetInstrQuery = req.query;

    if (!symbol) {
        return res.status(400).json({
            message: 'Bad symbol',
            success: false,
        });
    }
    try {
        const result = await bybit.getInstrumentsInfo({
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
            message: 'Unable to get instruments info',
            success: false,
        });
    }
};
