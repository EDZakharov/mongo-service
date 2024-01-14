import { InferSchemaType, Schema, model } from 'mongoose';
import { Coin } from './coinsModel';

const getValidCoins = async () => {
    const coins = await Coin.find({}, 'symbol -_id');
    return coins.map((coin) => coin.symbol);
};

const StrategySchema = new Schema(
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
        strategy: {
            type: [
                {
                    step: { type: Number, required: true },
                    orderDeviation: { type: Number, required: true },
                    orderSecondaryPairVolume: { type: Number, required: true },
                    orderBasePairVolume: { type: Number, required: true },
                    orderPriceToStep: { type: Number, required: true },
                    orderAveragePrice: { type: Number, required: true },
                    orderTargetPrice: { type: Number, required: true },
                    orderTargetDeviation: { type: Number, required: true },
                    summarizedOrderSecondaryPairVolume: {
                        type: Number,
                        required: true,
                    },
                    summarizedOrderBasePairVolume: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
        },
    },
    { timestamps: true }
);

export type StrategySchema = InferSchemaType<typeof StrategySchema>;
export const Strategy = model('strategies', StrategySchema);
