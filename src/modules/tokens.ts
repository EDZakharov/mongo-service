import jwt from 'jsonwebtoken';
import { TokenModel } from '../models/tokenModel';
import { ObjectId } from '../models/usermodel';

interface IGenTokens {
    accessToken: string;
    refreshToken: string;
}

export function generateTokens(
    payload: any,
    accessSecret: string,
    refreshSecret: string
): IGenTokens {
    const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: '20m',
    });
    const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: '15d',
    });
    return {
        accessToken,
        refreshToken,
    };
}

export async function saveRefreshToken(userId: ObjectId, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ userId });

    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await TokenModel.create({ userId, refreshToken });
    return token;
}

export async function removeRefreshToken(refreshToken: string) {
    const result = await TokenModel.deleteOne({ refreshToken });
    return result;
}

export async function findRefreshToken(refreshToken: string) {
    const result = await TokenModel.findOne({ refreshToken });
    return result;
}

export async function validateAccessToken(
    accessToken: string,
    accessSecret: string
): Promise<string | jwt.JwtPayload | undefined> {
    try {
        const result = jwt.verify(accessToken, accessSecret);
        return result;
    } catch (error) {
        return;
    }
}

export async function validateRefreshToken(
    refreshToken: string,
    refreshSecret: string
): Promise<string | jwt.JwtPayload | undefined> {
    try {
        const result = jwt.verify(refreshToken, refreshSecret);
        return result;
    } catch (error) {
        return;
    }
}

export const getTokens = async (res: any) => {
    try {
        const result = await TokenModel.find({});
        if (!result) {
            return res.status(400).json({
                message: 'Tokens not found',
                success: false,
            });
        }
        return res.status(200).json(result);
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to find tokens',
            success: false,
        });
    }
};

export const deleteToken = async (userId: ObjectId, token: string) => {
    try {
        const result = await TokenModel.findOne({ userId });
        if (!result) {
            return;
        }
        if (result.refreshToken === token) {
            await TokenModel.deleteOne({ userId });
        }
        return;
    } catch (error) {
        //add logger
        return;
    }
};

export const deleteTokens = async (res: any) => {
    try {
        const result = await TokenModel.deleteMany({});
        if (!result) {
            return res.status(400).json({
                message: 'Tokens not found',
                success: false,
            });
        }
        return res.status(200).json(result);
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to delete tokens',
            success: false,
        });
    }
};
