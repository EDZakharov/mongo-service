import { InferSchemaType, Schema, model } from 'mongoose';

const TokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    refreshToken: { type: String, required: true },
});
export type UserToken = InferSchemaType<typeof TokenSchema>;
export const TokenModel = model('tokens', TokenSchema);
