import bcrypt from 'bcrypt';
import { Response } from 'express';
import { config } from '../config';
import UserDTO from '../dto/userDTO';
import { User } from '../models/usermodel';
import { generateTokens, saveRefreshToken } from './tokens';

interface IUserCredentials {
    username: string;
    password: string;
}

export const userLogin = async (
    userCredentials: any,
    role: string,
    res: Response
) => {
    const checkAccessSecret = config.DB_SECRET_ACCESS_TOKEN;
    const checkRefreshSecret = config.DB_SECRET_REFRESH_TOKEN;
    if (!checkAccessSecret || !checkRefreshSecret) {
        return res.status(506).json({
            message: 'The server encountered an internal configuration error',
            success: false,
        });
    }

    const { username, password }: IUserCredentials = userCredentials;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: 'Username not found',
            success: false,
        });
    }

    if (user.role !== role) {
        return res.status(403).json({
            message:
                'The client does not have permission to access the content',
            success: false,
        });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
        return res.status(403).json({
            message: 'Incorrect password',
            success: false,
        });
    }
    const userDto = new UserDTO(user);
    const tokens = generateTokens(
        { ...userDto },
        checkAccessSecret,
        checkRefreshSecret
    );

    await saveRefreshToken(userDto.id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
    });
    return res.status(200).json({
        userId: userDto.id,
        accessToken: tokens.accessToken,
        message: 'You are now logged in',
        success: true,
    });
};
