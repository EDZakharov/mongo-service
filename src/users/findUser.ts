import { User } from '../models/usermodel';

export const findUser = async function (id: string) {
    const user = await User.findById(id);
    return user;
};
