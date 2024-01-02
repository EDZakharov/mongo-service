import { User } from '../models/usermodel';
import { IUser } from '../types/types';

export const addUser = async function (user: IUser) {
    const hasError = isUser(user);
    if (!hasError) {
        const newUser = new User(user);
        await newUser.save();
        return newUser;
    } else {
        console.error('add user error: bad info!');
    }
};

function isUser(userInfo: any): userInfo is IUser {
    const userInfoAsIUser = userInfo as IUser;
    return !userInfoAsIUser.name || !userInfoAsIUser.age;
}
