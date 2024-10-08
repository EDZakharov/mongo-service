import { Request, Response } from 'express';
import { Coin } from '../../../models/coinsModel';
import { addInnerBuyOrder } from '../../../modules/orders';
import { bybit } from '../bybit';

export interface IPlaceOrder {
    symbol?: string;
    qty?: string;
    price?: string;
    side?: string;
    orderType?: string;
}
export interface IPlaceOrderId {
    id?: string;
}

export const placeOrder =
    (side: 'Buy' | 'Sell', orderType: 'Limit' | 'Market') =>
    async (req: Request, res: Response) => {
        const { symbol, qty, price }: IPlaceOrder = req.body;
        const { id }: IPlaceOrderId = req.query;

        if (!symbol || !qty || !id || !side || !orderType) {
            return res.status(400).json({
                message: 'Bad request data',
                success: false,
            });
        }

        if (side === 'Sell' && !price) {
            return res.status(400).json({
                message: 'Bad request data',
                success: false,
            });
        }

        if (id.length !== 24) {
            return res.status(400).json({
                message: 'Id must be 24 hex string',
                status: false,
            });
        }

        try {
            const validateSymbol = (await Coin.find({}, 'symbol -_id')).map(
                (coin) => coin.symbol
            );

            if (!validateSymbol.includes(symbol)) {
                throw new Error('Coin validation failed');
            }

            if (side === 'Buy' && orderType === 'Market') {
                const result = await bybit.submitOrder({
                    category: 'spot',
                    orderType,
                    side,
                    symbol,
                    qty,
                });

                if (
                    (result && !result.result.orderId) ||
                    (result && !result.result.orderLinkId)
                ) {
                    throw new Error(result.retMsg);
                }

                const addResult = await addInnerBuyOrder({
                    coin: symbol,
                    orderId: result.result.orderId,
                    orderLinkId: result.result.orderLinkId,
                    id,
                    side,
                });

                if (!addResult.status) {
                    await bybit.cancelOrder({
                        category: 'spot',
                        symbol,
                        orderId: result.result.orderId,
                    });

                    throw new Error(addResult.message);
                }

                return res.status(200).json({
                    ...result,
                    ...addResult,
                    success: true,
                });
            }

            if (side === 'Sell' && orderType === 'Limit') {
                const result = await bybit.submitOrder({
                    category: 'spot',
                    orderType,
                    side,
                    symbol,
                    qty,
                    price,
                });

                if (
                    (result && !result.result.orderId) ||
                    (result && !result.result.orderLinkId)
                ) {
                    throw new Error(result.retMsg);
                }

                const addResult = await addInnerBuyOrder({
                    coin: symbol,
                    orderId: result.result.orderId,
                    orderLinkId: result.result.orderLinkId,
                    id,
                    side,
                });

                if (!addResult.status) {
                    await bybit.cancelOrder({
                        category: 'spot',
                        symbol,
                        orderId: result.result.orderId,
                    });

                    throw new Error(addResult.message);
                }

                return res.status(200).json({
                    ...result,
                    ...addResult,
                    success: true,
                });
            }
            throw new Error('Something went wrong');
        } catch (error: any) {
            console.log(error);

            if (error.message) {
                return res.status(400).json({
                    message: `Unable to place buy order. ${error.message}`,
                    success: false,
                });
            }

            return res.status(400).json({
                message: `Unable to place buy order`,
                success: false,
            });
        }
    };
