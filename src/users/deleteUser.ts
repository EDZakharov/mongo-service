import { User } from '../models/usermodel';

export const deleteUser = async function (id: string) {
    await User.findByIdAndDelete(id);
};
