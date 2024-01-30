import { InferSchemaType, Schema, model } from 'mongoose';

const ApiKeysSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    exchange: {
        type: String,
        enum: [
            'bybit',
            'binance',
            'okx',
            'kukoin',
            'bitfinex',
            'coinbase',
            'kraken',
            'gemini',
        ],
        required: true,
        // validate: {
        //     validator: async function (user: Types.ObjectId) {
        //         const foundUsers = await getUser();
        //         return foundUsers
        //             .map((foundUser) => foundUser.toString())
        //             .includes(user.toString());
        //     },
        //     message: 'User not found',
        // },
    },
    apiKey: {
        type: String,
        required: true,
    },
    apiSecretKey: {
        type: String,
        required: true,
    },
});
export type ApiKeysModel = InferSchemaType<typeof ApiKeysSchema>;
export const ApiKeys = model('apiKeys', ApiKeysSchema);
