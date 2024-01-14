import { Request, Response } from 'express';
import { config } from '../config';
import UserDTO from '../dto/userDTO';
import { TokenModel } from '../models/tokenModel';
import { User } from '../models/usermodel';
import { showUnauthorizedError } from '../utils/unauthorizedError';
import { generateTokens, saveRefreshToken } from './tokens';

export const refresh = async (req: Request, res: Response) => {
    const checkAccessSecret = config.DB_SECRET_ACCESS_TOKEN;
    const checkRefreshSecret = config.DB_SECRET_REFRESH_TOKEN;
    if (!checkAccessSecret || !checkRefreshSecret) {
        return res.status(506).json({
            message: 'The server encountered an internal configuration error',
            success: false,
        });
    }

    const refreshToken: string | undefined = req.cookies.refreshToken;

    if (!refreshToken) {
        return showUnauthorizedError(res);
    }

    const token = await TokenModel.findOne({
        refreshToken,
    });

    if (!token) {
        return showUnauthorizedError(res);
    }

    const user = await User.findById(token.userId);
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
        message: 'Refresh tokens',
        success: true,
    });
};
