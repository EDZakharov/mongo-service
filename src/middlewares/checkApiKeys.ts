import { RestClientV5 } from 'bybit-api';
import { NextFunction, Request, Response } from 'express';
import { IRestClientOptions } from '../exchanges/bybit/bybit';
import { ApiKeys } from '../models/apiKeysModule';

export const withCheckApiKeys =
    (exchange: string) =>
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { id } = req.query;

        if (!exchange) {
            return res.status(400).json({
                message: 'Bad exchange',
                status: false,
            });
        }

        if (!id || id.length !== 24) {
            return res.status(400).json({
                message: 'Id must be 24 hex string',
                status: false,
            });
        }

        try {
            const apiKey = await ApiKeys.findOne({ id, exchange });

            if (!apiKey || !apiKey.apiKey || !apiKey.apiSecretKey) {
                return res.status(404).json({
                    message: `Api keys with user ${id} not found`,
                    status: false,
                });
            }

            if (exchange === 'bybit') {
                const restClientOptions: IRestClientOptions = {
                    testnet: false,
                    key: apiKey.apiKey,
                    secret: apiKey.apiSecretKey,
                    enable_time_sync: true,
                    recv_window: 5000,
                    baseUrl: 'https://api.bybit.com/',
                };
                const testBybit = new RestClientV5(restClientOptions);
                const accountInfo = await testBybit.getWalletBalance({
                    accountType: 'UNIFIED',
                });

                if (
                    !accountInfo ||
                    accountInfo.retMsg !== 'OK' ||
                    !accountInfo.result.list
                ) {
                    throw new Error('Exchange not supported');
                }

                return next();
            } else {
                throw new Error('Exchange not supported');
            }
        } catch (error: any) {
            return res.status(400).json({
                message: `Something went wrong. ${error.message}`,
                status: false,
            });
        }
    };
