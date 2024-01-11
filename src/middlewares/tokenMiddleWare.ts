import JWT from 'jsonwebtoken';
import { config } from '../config';
import { TokenModel } from '../models/tokenModel';

interface IPayload {
    user: string;
    refreshToken: string;
}
interface IGenTokens {
    accessToken: string;
    refreshToken: string;
}

export function generateTokens(payload: IPayload): IGenTokens | undefined {
    if (!config.DB_SECRET_ACCESS_TOKEN || !config.DB_SECRET_REFRESH_TOKEN) {
        return;
    }
    const accessToken = JWT.sign(payload, config.DB_SECRET_ACCESS_TOKEN, {
        expiresIn: '30m',
    });
    const refreshToken = JWT.sign(payload, config.DB_SECRET_REFRESH_TOKEN, {
        expiresIn: '30d',
    });
    return {
        accessToken,
        refreshToken,
    };
}

export async function saveToken(userID: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ userID });

    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await TokenModel.create({ user: userID, refreshToken });
    return token;
}

export async function removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
}

export async function findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
}

export async function validateAccessToken(
    accessToken: string
): Promise<string | JWT.JwtPayload | undefined> {
    if (!config.DB_SECRET_ACCESS_TOKEN) {
        return;
    }
    try {
        const result = JWT.verify(accessToken, config.DB_SECRET_ACCESS_TOKEN);
        return result;
    } catch (e) {
        return;
    }
}

export async function validateRefreshToken(
    refreshToken: string
): Promise<string | JWT.JwtPayload | undefined> {
    if (!config.DB_SECRET_REFRESH_TOKEN) {
        return;
    }
    try {
        const result = JWT.verify(refreshToken, config.DB_SECRET_REFRESH_TOKEN);
        return result;
    } catch (e) {
        return;
    }
}
