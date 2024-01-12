import bcrypt from 'bcrypt';
import { Response } from 'express';
import { config } from '../config';
import { User } from '../models/usermodel';

interface IUserCredentials {
    username: string;
    email: string;
    name: string;
    password: string;
}

export const userRegister = async (
    userCredentials: IUserCredentials,
    role: string,
    res: Response
) => {
    try {
        const checkAccessSecret = config.DB_SECRET_ACCESS_TOKEN;
        const checkRefreshSecret = config.DB_SECRET_REFRESH_TOKEN;
        if (!checkAccessSecret || !checkRefreshSecret) {
            return res.status(506).json({
                message:
                    'The server encountered an internal configuration error',
                success: false,
            });
        }

        const usernameNotTaken = await validateUsername(
            userCredentials.username
        );
        if (usernameNotTaken) {
            return res.status(400).json({
                message: `Username ${userCredentials.username} is already taken`,
                success: false,
            });
        }

        const emailNotRegistered = await validateEmail(userCredentials.email);
        if (emailNotRegistered) {
            return res.status(400).json({
                message: `Email ${userCredentials.email} is already registered`,
                success: false,
            });
        }

        const password = await bcrypt.hash(userCredentials.password, 12);

        const newUser = new User({
            ...userCredentials,
            password,
            role,
        });

        await newUser.save();

        return res.status(201).json({
            username: newUser.username,
            createdAt: newUser.createdAt,
            message: 'User was registered',
            success: true,
        });
    } catch (error) {
        //add logger
        console.log(error);
        return res.status(400).json({
            message: 'Unable to create your account',
            success: false,
        });
    }
};

const validateUsername = async (username: string) => {
    const user = await User.findOne({ username });
    return user ? true : false;
};

const validateEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user ? true : false;
};
