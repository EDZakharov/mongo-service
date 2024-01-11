import { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { validateAccessToken } from '../modules/tokens';

export async function withAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            return showUnauthorizedError(res);
        }

        if (!config.DB_SECRET_ACCESS_TOKEN) {
            return res.status(506).json({
                message:
                    'The server encountered an internal configuration error',
                success: false,
            });
        }

        const result = await validateAccessToken(
            accessToken,
            config.DB_SECRET_ACCESS_TOKEN
        );

        if (!result) {
            return showUnauthorizedError(res);
        }
        req.user = result;

        next();
    } catch (e) {
        return showUnauthorizedError(res);
    }
}

function showUnauthorizedError(res: Response): Response {
    return res.status(401).json({ message: 'Unauthorized', success: false });
}

// export const serializeUser = (user: any) => {
//     return {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//         updateAt: user.updatedAt,
//         createAt: user.createdAt,
//     };
// };
