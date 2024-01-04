import bcrypt from 'bcrypt';
import { User } from '../models/usermodel';

export const userRegister = async (userData: any, role: string, res: any) => {
    try {
        let usernameNotTaken = await validateUsername(userData.username);

        if (usernameNotTaken) {
            console.log('1', usernameNotTaken);
            return res.status(400).json({
                message: `Username ${userData.username} is already taken`,
                success: false,
            });
        }
        let emailNotRegistered = await validateEmail(userData.email);

        if (emailNotRegistered) {
            console.log('2', emailNotRegistered);
            return res.status(400).json({
                message: `Email ${userData.email} is already registered`,
                success: false,
            });
        }

        const password = await bcrypt.hash(userData.password, 12);
        const newUser = new User({
            ...userData,
            password,
            role,
        });
        await newUser.save();
        return res.status(201).json({
            message: 'User was registered',
            success: true,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to create your account',
            success: false,
        });
    }
};

const validateUsername = async (username: string) => {
    let user = await User.findOne({ username });

    return user ? true : false;
};

const validateEmail = async (email: string) => {
    let user = await User.findOne({ email });

    return user ? true : false;
};
