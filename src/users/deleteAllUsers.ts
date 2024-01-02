import { User } from '../models/usermodel';

export const deleteAllUsers = async function () {
    await User.deleteMany({});
};
