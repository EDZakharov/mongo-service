import { InferSchemaType, Schema, Types, model } from 'mongoose';

const UserSchema = new Schema(
    {
        id: { type: Schema.Types.ObjectId },
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export type UserSchema = InferSchemaType<typeof UserSchema>;
export type ObjectId = Types.ObjectId;
export const User = model('users', UserSchema);
