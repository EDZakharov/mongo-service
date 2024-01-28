import { RestClientV5 } from 'bybit-api';

import { config } from '../../config/index';

export interface IRestClientOptions {
    key?: string;
    secret?: string;
    testnet?: boolean;
    recv_window?: number;
    enable_time_sync?: boolean;
    baseUrl?: string;
}

const restClientOptions: IRestClientOptions = {
    testnet: false,
    key: config.APP_KEY_BYBIT,
    secret: config.APP_SECRET_KEY_BYBIT,
    enable_time_sync: true,
    recv_window: 5000,
    baseUrl: 'https://api.bybit.com/',
};

export const bybit = new RestClientV5(restClientOptions);
