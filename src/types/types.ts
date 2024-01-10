import { NextFunction } from 'express';

export interface IUser {
    name: string;
    age: Number;
}
export interface PassportType {
    initialize(): (req: Request, res: Response, next: NextFunction) => void;
}
