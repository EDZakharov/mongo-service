import { Response } from 'express';
import { User } from '../models/usermodel';

export const getUsers = async (res: Response) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(400).json({
                message: 'Users not found',
                success: false,
            });
        }
        return res.status(200).json(users);
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to find users',
            success: false,
        });
    }
};

export const deleteUsers = async (res: Response) => {
    try {
        const users = await User.deleteMany({});
        if (!users) {
            return res.status(400).json({
                message: 'Users not found',
                success: false,
            });
        }
        return res.status(200).json(users);
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to delete users',
            success: false,
        });
    }
};

export const getRole = async (email: string): Promise<undefined | string> => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return;
        }
        return user.role;
    } catch (error) {
        //add logger
        return;
    }
};
