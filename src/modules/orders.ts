import { Request, Response } from 'express';
import { Coin } from '../models/coinsModel';
import { Order } from '../models/ordersModel';

export const addOrder = async (req: Request, res: Response) => {
    try {
        const { side, orderId, orderLinkId } = req.body.orders;
        const { coin } = req.body;
        const { id } = req.query;

        if (!coin || !side || !orderId || !orderLinkId) {
            return res.status(400).json({
                message: 'Invalid post data',
                success: false,
            });
        }

        if (!id) {
            return res.status(400).json({
                message: 'Invalid query data',
                success: false,
            });
        }

        const foundDuplicate = await Order.findOne({
            coin,
            side,
        });
        // const foundDuplicate1 = await Order.deleteOne({ orderId: null });
        // console.log(foundDuplicate1);

        if (!foundDuplicate) {
            await Order.create({
                userId: id,
                coin,
                orders: {
                    side,
                    orderId,
                    orderLinkId,
                },
            });
        } else {
            await Order.updateOne(
                { userId: id, coin, side },
                {
                    orders: {
                        side,
                        orderId,
                        orderLinkId,
                    },
                }
            );

            return res.status(201).json({
                message: `${side} order was updated`,
                status: true,
            });
        }
        return res.status(201).json({
            message: `${side} order was created`,
            success: true,
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: 'Unable to create order',
            success: false,
        });
    }
};

export const getAllOrders = async (res: Response) => {
    try {
        const allOrders = await Order.find({});
        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({
                message: 'Orders not found',
                success: false,
            });
        }

        return res.status(200).json({
            ...allOrders,
            message: `Orders found`,
            success: true,
            count: allOrders.length,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to find orders',
            success: false,
        });
    }
};

export const getOrder = async (res: Response) => {
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

export const deleteOrder = async (res: Response) => {
    try {
        const validCoins = await Order.find({});
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

export const deleteAllOrders = async (res: Response) => {
    try {
        const result = await Order.deleteMany({});
        if (!result) {
            return res.status(400).json({
                message: 'Orders not found',
                success: false,
            });
        }
        return res.status(200).json({
            ...result,
            message: `Orders was deleted`,
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to delete orders',
            success: false,
        });
    }
};
