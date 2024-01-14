import { Response } from 'express';

export const userLogout = async (res: Response) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'You are logged out' });
};
