import { Request, Response } from 'express';
import { config } from '../config';
import UserDTO from '../dto/userDTO';
import { TokenModel } from '../models/tokenModel';
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

    const cookie = req.headers.cookie;

    if (!cookie) {
        return showUnauthorizedError(res);
    }
    const user = await TokenModel.findOne({
        refreshToken: cookie,
    });
    console.log(user);

    if (!user) {
        return showUnauthorizedError(res);
    }

    const userDto = new UserDTO(user);
    const tokens = generateTokens(
        { ...userDto },
        checkAccessSecret,
        checkRefreshSecret
    );
    // await deleteToken(userDto.id, tokens.refreshToken);
    await saveRefreshToken(userDto.id, tokens.refreshToken);

    let result = {
        accessToken: tokens.accessToken,
        // refreshToken: tokens.refreshToken,
    };
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return res.status(200).json({
        ...result,
        message: 'You are now logged in',
        success: true,
    });
};
