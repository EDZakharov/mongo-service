import { Response } from 'express';

export function showUnauthorizedError(res: Response): Response {
    return res.status(401).json({ message: 'Unauthorized', success: false });
}
