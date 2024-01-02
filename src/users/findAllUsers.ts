import { User } from '../models/usermodel';

export const findAllUsers = async function () {
    const users = await User.find({});
    return users;
};
