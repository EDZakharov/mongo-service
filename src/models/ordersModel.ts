import { NextFunction } from 'express';
import { Document, InferSchemaType, Schema, Types, model } from 'mongoose';
import { Coin } from './coinsModel';
import { User } from './usermodel';

const getValidCoins = async () => {
    const coins = await Coin.find({}, 'symbol -_id');
    return coins.map((coin) => coin.symbol);
};

const getUser = async () => {
    const users = await User.find({}, '_id');

    return users.map((user) => user._id);
};

interface OrderDocument extends Document {
    userId: Schema.Types.ObjectId;
    coin: string;
    side: string;
    orderId: string;
    orderLinkId: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            validate: {
                validator: async function (user: Types.ObjectId) {
                    const foundUsers = await getUser();
                    return foundUsers
                        .map((foundUser) => foundUser.toString())
                        .includes(user.toString());
                },
                message: 'User not found',
            },
        },

        coin: {
            type: String,
            required: true,
            validate: {
                validator: async function (coin: string) {
                    const validCoins = await getValidCoins();
                    return validCoins.includes(coin);
                },
                message: 'Invalid coin symbol',
            },
        },

        side: {
            type: String,
            enum: ['buy', 'sell'],
            required: true,
        },

        orderId: {
            type: String,
            required: true,
        },

        orderLinkId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// @ts-ignore
orderSchema.pre<OrderDocument>('save', async function (next: NextFunction) {
    const maxOrders = 1;
    const order = this as OrderDocument;
    try {
        const count = await Order.countDocuments({
            coin: order.coin,
            side: order.side,
            userId: order.userId,
        });
        if (count >= maxOrders) {
            throw new Error(
                JSON.stringify({
                    message: `Maximum ${maxOrders} orders reached for side ${order.side} to coin ${order.coin}`,
                    status: false,
                })
            );
        }

        next();
    } catch (error) {
        next(error);
    }
});

export type OrderSchema = InferSchemaType<typeof orderSchema>;
export const Order = model('orders', orderSchema);
