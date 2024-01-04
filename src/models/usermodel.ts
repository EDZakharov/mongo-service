import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // id: {
    //     type: Schema.Types.ObjectId,
    //     index: true,
    //     unique: true,
    //     required: true,
    // },
    name: String,
    age: Number,
});

export const User = mongoose.model('User', UserSchema);
