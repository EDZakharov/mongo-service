import { Request, Response } from 'express';
import ApiKeysDto from '../dto/apiKeyDTO';
import { ApiKeys } from '../models/apiKeysModule';

interface ISetApiKey {
    exchange?: string;
    apiKey?: string;
    apiSecretKey?: string;
}

interface ISetApiKeyQuery {
    id?: string;
}

export const setApiKey = async (req: Request, res: Response) => {
    try {
        const { exchange, apiKey, apiSecretKey }: ISetApiKey = req.body;
        const { id }: ISetApiKeyQuery = req.query;

        if (!exchange || !apiKey || !apiSecretKey) {
            return res.status(400).json({
                message: 'Invalid post data',
                success: false,
            });
        }

        if (!id || id.length !== 24) {
            return res.status(400).json({
                message: 'Invalid query data',
                success: false,
            });
        }

        const foundDuplicate = await ApiKeys.findOne({
            id,
            exchange,
            apiKey,
            apiSecretKey,
        });

        if (!foundDuplicate) {
            const newApiKey = new ApiKeys({
                id,
                exchange,
                apiKey,
                apiSecretKey,
            });

            await newApiKey.save();

            return res.status(201).json({
                message: `Api key was added`,
                success: true,
            });
        } else {
            await ApiKeys.updateOne(
                { id, exchange },
                {
                    apiKey,
                    apiSecretKey,
                }
            );

            return res.status(201).json({
                message: `Api key was updated`,
                status: true,
            });
        }
    } catch (error: any) {
        console.log(error);

        const searchRegEx = /\{([^}]+)\}/gm;
        const stringifiedError = error.toString().match(searchRegEx);
        const parsedError = JSON.parse(stringifiedError);

        if (parsedError && parsedError.message) {
            return res.status(400).json({
                message: `${parsedError.message}`,
                success: false,
            });
        } else if (error._message && error.errors?.userId) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        } else {
            return res.status(400).json({
                message: 'Unable to add api key',
                success: false,
            });
        }
    }
};

interface IGetApiKeyQuery {
    id?: string;
    exchange?: string;
}

export async function getApiKey(req: Request, res: Response) {
    try {
        const { exchange, id }: IGetApiKeyQuery = req.query;

        if (!exchange || !id) {
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

        const apiKey = await ApiKeys.findOne({ id, exchange });

        if (!apiKey) {
            return res.status(404).json({
                message: `Api key with user ${id} not found`,
                status: false,
            });
        }

        const apiKeyDto = new ApiKeysDto(apiKey);

        return res.status(200).json({
            ...apiKeyDto,
            message: 'Api key found',
            status: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get api key',
            status: false,
        });
    }
}

export async function _innerGetApiKeys(
    exchange?: string,
    APP_KEY_EXCHANGE?: string,
    APP_SECRET_KEY_EXCHANGE?: string
) {
    try {
        if (!APP_KEY_EXCHANGE || !APP_SECRET_KEY_EXCHANGE || !exchange) {
            return {
                message: 'Bad api keys',
                status: false,
            };
        }

        const apiKeys = await ApiKeys.findOne({
            APP_KEY_EXCHANGE,
            APP_SECRET_KEY_EXCHANGE,
            exchange,
        });

        if (!apiKeys) {
            return {
                message: 'Api keys not found',
                status: false,
            };
        }

        const apiKeyDto = new ApiKeysDto(apiKeys);

        return {
            ...apiKeyDto,
            message: 'Bad api keys',
            status: false,
        };
    } catch (error: any) {
        return {
            message: `Unable to get api keys. ${error.message}`,
            status: false,
        };
    }
}

export async function getAllApiKeys(res: Response) {
    try {
        const apiKeys = await ApiKeys.find({});

        if (!apiKeys || apiKeys.length === 0) {
            return res.status(404).json({
                message: `Api keys not found`,
                status: false,
            });
        }

        const apiKeysDto = apiKeys.map((apiKey) => new ApiKeysDto(apiKey));

        return res.status(200).json({
            ...apiKeysDto,
            message: 'Api keys found',
            count: apiKeys.length,
            status: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Unable to get api keys',
            status: false,
        });
    }
}

export const deleteApiKey = async (req: Request, res: Response) => {
    try {
        const { id, exchange }: IGetApiKeyQuery = req.query;

        if (!id || !exchange) {
            return res.status(400).json({
                message: 'Bad query',
                status: false,
            });
        }

        const apiKeys = await ApiKeys.deleteOne({ id, exchange });
        if (!apiKeys) {
            return res.status(404).json({
                message: 'Api keys not found',
                success: false,
            });
        }
        return res.status(200).json({
            ...apiKeys,
            message: 'Api keys was deleted',
            success: true,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to delete api keys',
            success: false,
        });
    }
};
