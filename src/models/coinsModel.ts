import { InferSchemaType, Schema, model } from 'mongoose';

const CoinSchema = new Schema({
    symbol: { type: String, unique: true, required: true },
});

export type CoinsSchema = InferSchemaType<typeof CoinSchema>;
export const Coin = model('coins', CoinSchema);
