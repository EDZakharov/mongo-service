import { NextFunction, Response } from 'express';
import { getRole } from '../modules/users';

export const withCheckRole =
    (roles: string[]) =>
    async (
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const role = await getRole(req.user.email);
        if (role && roles.includes(role)) return next();
        return res
            .status(401)
            .json({ message: 'Unauthorized', success: false });
    };
