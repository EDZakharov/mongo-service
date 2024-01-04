import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
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

export const User = model('users', UserSchema);
