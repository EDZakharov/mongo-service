import { NextFunction } from 'express';

export interface IUser {
    name: string;
    age: Number;
}
export interface PassportType {
    initialize(): (req: Request, res: Response, next: NextFunction) => void;
}

export interface IBuyOrdersStepsToGrid {
    symbol?: string;
    step: number;
    orderDeviation: number;
    orderBasePairVolume: number;
    orderSecondaryPairVolume: number;
    orderPriceToStep: number;
    orderAveragePrice: number;
    orderTargetPrice: number;
    orderTargetDeviation: number;
    summarizedOrderBasePairVolume: number;
    summarizedOrderSecondaryPairVolume: number;
}

export type ISetOrdersStepsToMongo = IBuyOrdersStepsToGrid[];
