import { InferSchemaType, Schema, model } from 'mongoose';

const CurrentStepSchema = new Schema({
    id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    coin: { type: String, ref: 'coins', required: true },
    step: { type: Number, required: true },
});
export type CurrentStepModel = InferSchemaType<typeof CurrentStepSchema>;
export const CurrentStepModel = model('currentStep', CurrentStepSchema);
