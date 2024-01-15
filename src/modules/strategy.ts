import { Request, Response } from 'express';
import StrategyDto from '../dto/strategyDTO';
import { Strategy } from '../models/strategyModel';
import { User } from '../models/usermodel';
import { ISetOrdersStepsToMongo } from '../types/types';
import { showUnauthorizedError } from '../utils/unauthorizedError';

interface IBody {
    strategy?: ISetOrdersStepsToMongo;
}

interface IReqCoin {
    coin?: string;
    id?: string;
}

export async function setStrategyToDb(req: Request, res: Response) {
    try {
        const { strategy }: IBody = req.body;
        const { id, coin }: IReqCoin = req.query;

        if (!coin || !id) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        if (id.length !== 24) {
            return res.status(400).json({
                message: 'Id must be 24 hex string',
                status: false,
            });
        }

        if (!strategy || strategy.length === 0) {
            return res.status(400).json({
                message: 'Bad strategy',
                status: false,
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return showUnauthorizedError(res);
        }

        let strategyFromDb = await Strategy.findOne({
            userId: user._id,
            coin,
        });

        if (!strategyFromDb) {
            await Strategy.create({
                userId: user._id,
                coin,
                strategy,
            });
        } else {
            await Strategy.updateOne(
                {
                    userId: user._id,
                    coin,
                },
                {
                    strategy,
                }
            );

            return res.status(201).json({
                message: 'Strategy was updated',
                status: true,
            });
        }

        return res.status(201).json({
            message: 'Strategy was created',
            status: true,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: `Unable to set strategy ${
                error.message ? '| ' + error.message : ''
            }`,
            status: false,
        });
    }
}

export async function getStrategyFromDb(req: Request, res: Response) {
    try {
        const { coin, id }: IReqCoin = req.query;

        if (!coin || !id) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        if (id.length !== 24) {
            return res.status(400).json({
                message: 'Id must be 24 hex string',
                status: false,
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: `User with id ${id} not found`,
                status: false,
            });
        }

        const result = await Strategy.findOne({ userId: user._id, coin });
        if (!result) {
            return res.status(404).json({
                message: 'Strategy not found',
                status: false,
            });
        }

        const serializedStrategy = result.strategy.map(
            (serializedStep) => new StrategyDto(serializedStep)
        );

        return res.status(200).json({
            ...serializedStrategy,
            coin,
            message: 'Strategy found',
            status: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get strategy',
            status: false,
        });
    }
}

interface IQuery {
    id?: string;
    coin?: string;
}

export async function deleteStrategyFromDb(req: Request, res: Response) {
    try {
        const { id, coin }: IQuery = req.query;

        if (!coin || !id) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        if (id.length !== 24) {
            return res.status(400).json({
                message: 'Id must be 24 hex string',
                status: false,
            });
        }

        const deletedStrategy = await Strategy.findOneAndDelete({
            userId: id,
            coin,
        });
        if (!deletedStrategy) {
            return res.status(404).json({
                message: 'Strategies not found',
                status: false,
            });
        }

        return res.status(200).json({
            message: 'Strategy deleted',
            status: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to delete strategy',
            status: false,
        });
    }
}

//ADMIN QUERY
export async function getAllStrategiesFromDb(res: Response) {
    try {
        const result = await Strategy.find({});
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: 'Strategies not found',
                status: false,
            });
        }

        const serializedStrategy = result.map((obj) => {
            return {
                userId: obj.userId,
                coin: obj.coin,
                strategy: obj.strategy.map(
                    (serializedStep) => new StrategyDto(serializedStep)
                ),
            };
        });

        return res.status(200).json({
            ...serializedStrategy,
            message: 'Strategies found',
            status: true,
            count: serializedStrategy.length,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get strategies',
            status: false,
        });
    }
}

//ADMIN QUERY
export async function deleteAllStrategiesFromDb(res: Response) {
    try {
        const strategy = await Strategy.deleteMany({});
        if (!strategy) {
            return res.status(404).json({
                message: 'Strategies not found',
                status: false,
            });
        }

        return res.status(200).json({
            ...strategy,
            message: 'Strategies deleted',
            status: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to delete strategies',
            status: false,
        });
    }
}
