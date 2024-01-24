import { InferSchemaType, Schema, model } from 'mongoose';
import { Coin } from './coinsModel';

const getValidCoins = async () => {
    const coins = await Coin.find({}, 'symbol -_id');
    return coins.map((coin) => coin.symbol);
};

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
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

        orders: {
            type: {
                side: {
                    type: String,
                    validate: {
                        validator: async function (side: string) {
                            return side === 'sell' || side === 'buy';
                        },
                        message: 'Invalid side',
                    },
                    required: true,
                },
                orderId: {
                    type: String,
                    required: true,
                    unique: true,
                },
                orderLinkId: {
                    type: String,
                    required: true,
                    unique: true,
                },
            },
            required: true,
        },
    },
    { timestamps: true }
);

export type OrderSchema = InferSchemaType<typeof orderSchema>;
export const Order = model('orders', orderSchema);
