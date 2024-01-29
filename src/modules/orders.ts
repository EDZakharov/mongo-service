import { Request, Response } from 'express';
import orderDTO from '../dto/orderDTO';
import { IPlaceOrder } from '../exchanges/bybit/trade/placeOrder';
import { Coin } from '../models/coinsModel';
import { Order } from '../models/ordersModel';

export const addOrder = async (req: Request, res: Response) => {
    try {
        const { side, coin, orderId, orderLinkId } = req.body;
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
            userId: id,
            coin,
            side,
            orderId,
            orderLinkId,
        });

        if (!foundDuplicate) {
            const newOrder = new Order({
                userId: id,
                coin,
                side,
                orderId,
                orderLinkId,
            });

            await newOrder.save();

            return res.status(201).json({
                message: `${side} order was created`,
                success: true,
            });
        } else {
            await Order.updateOne(
                { userId: id, coin, side },
                {
                    orderId,
                    orderLinkId,
                }
            );

            return res.status(201).json({
                message: `${side} order was updated`,
                status: true,
            });
        }
    } catch (error: any) {
        const searchRegEx = /\{([^}]+)\}/gm;
        const stringifiedError = error.toString().match(searchRegEx);
        const parsedError = JSON.parse(stringifiedError);

        if (parsedError && parsedError.message) {
            return res.status(400).json({
                message: `${parsedError.message}`,
                success: false,
            });
        } else if (error._message && error.errors?.userId) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        } else {
            return res.status(400).json({
                message: 'Unable to create order',
                success: false,
            });
        }
    }
};

interface IAddInnerBuyOrder extends IPlaceOrder {
    coin?: string;
    orderId?: string;
    orderLinkId?: string;
    id?: string;
}

export const addInnerBuyOrder = async ({
    coin,
    orderId,
    orderLinkId,
    id,
}: IAddInnerBuyOrder) => {
    try {
        if (!coin || !orderId || !orderLinkId || !id) {
            return { message: 'Bad params', status: false };
        }

        const foundDuplicate = await Order.findOne({
            userId: id,
            coin,
            side: 'Buy',
            orderId,
            orderLinkId,
        });

        if (!foundDuplicate) {
            const newOrder = new Order({
                userId: id,
                coin,
                side: 'Buy',
                orderId,
                orderLinkId,
            });

            await newOrder.save();

            return { message: 'Order was created', status: true };
        } else {
            await Order.updateOne(
                { userId: id, coin, side: 'Buy' },
                {
                    orderId,
                    orderLinkId,
                }
            );

            return { message: 'Order was updated', status: true };
        }
    } catch (error: any) {
        console.log(error);

        const searchRegEx = /\{([^}]+)\}/gm;
        const stringifiedError = error.toString().match(searchRegEx);
        const parsedError = JSON.parse(stringifiedError);

        if (parsedError && parsedError.message) {
            return { message: parsedError.message, status: false };
        } else if (error._message && error.errors?.userId) {
            return { message: 'User not found', status: false };
        } else {
            return { message: 'Unable to create order', status: false };
        }
    }
};

export const getAllOrders = async (res: Response) => {
    try {
        const orders = await Order.find({});
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: 'Orders not found',
                success: false,
            });
        }

        const orderDto = orders.map((order) => new orderDTO(order));

        return res.status(200).json({
            orders: orderDto,
            message: `Orders found`,
            success: true,
            count: orders.length,
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
