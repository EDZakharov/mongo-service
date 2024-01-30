import { Request, Response, Router } from 'express';
import { getWalletBalanceSpot } from '../exchanges/bybit/account/getBalance';
import { getFeeRateSpot } from '../exchanges/bybit/account/getFeeRate';
import { getInstrumentInfo } from '../exchanges/bybit/market/getInstrumentsInfo';
import { placeBuyOrder } from '../exchanges/bybit/trade/placeOrder';
import { withAuth } from '../middlewares/auth';
import { withCheckApiKeys } from '../middlewares/checkApiKeys';
import { withCheckRole } from '../middlewares/checkrole';
import { rateLimiter } from '../middlewares/rateLimiter';
import {
    deleteApiKey,
    getAllApiKeys,
    getApiKey,
    setApiKey,
} from '../modules/apiKeys';
import { addValidCoin, getValidCoins } from '../modules/coins';
import { userLogin } from '../modules/login';
import { userLogout } from '../modules/logout';
import { addOrder, deleteAllOrders, getAllOrders } from '../modules/orders';
import { refresh } from '../modules/refresh';
import { userRegister } from '../modules/registration';
import {
    deleteCurrentStep,
    getCurrentStep,
    setCurrentStep,
} from '../modules/steps';
import {
    deleteAllStrategiesFromDb,
    deleteStrategyFromDb,
    getAllStrategiesFromDb,
    getStrategyFromDb,
    setStrategyToDb,
} from '../modules/strategy';
import { deleteTokens, getTokens } from '../modules/tokens';
import { deleteUsers, getUsers } from '../modules/users';
export const router = Router();

const endpoints = {
    register_user: '/register-user',
    login_user: '/login-user',
    logout: '/logout',
    register_admin: '/register-admin',
    login_admin: '/login-admin',
    profile_user: '/profile-user',
    get_users: '/get-users',
    delete_users: '/delete-users',
    get_tokens: '/get-tokens',
    delete_tokens: '/delete-tokens',
    refresh_tokens: '/refresh-tokens',
    get_coin_strategy: '/get-coin-strategy',
    set_coin_strategy: '/set-coin-strategy',
    delete_coin_strategy: '/delete-coin-strategy',
    get_all_coin_strategy: '/get-all-coin-strategy',
    delete_all_coin_strategy: '/delete-all-coin-strategy',
    add_valid_coin: '/add-valid-coin',
    get_valid_coins: '/get-valid-coins',
    get_current_step: '/get-current-step',
    set_current_step: '/set-current-step',
    delete_current_step: '/delete-current-step',
    add_order: '/add-order',
    get_order: '/get-order',
    get_all_orders: '/get-all-orders',
    delete_order: '/delete-order',
    delete_all_orders: '/delete-all-orders',
    set_api_key: '/set-api-key',
    get_api_key: '/get-api-key',
    get_all_api_keys: '/get-all-api-keys',
    delete_api_key: '/delete-api-key',
    //BYBIT
    get_instruments_info_bybit: '/get-instruments-info-bybit',
    get_wallet_balance_spot_bybit: '/get-wallet-balance-spot-bybit',
    get_fee_rate_spot_bybit: '/get-fee-rate-spot-bybit',
    place_buy_order_spot_bybit: '/place-buy-order-spot-bybit',
};

router.post(
    endpoints.set_api_key,
    rateLimiter,
    async (req: Request, res: Response) => {
        await setApiKey(req, res);
    }
);

router.get(
    endpoints.get_api_key,
    rateLimiter,
    async (req: Request, res: Response) => {
        await getApiKey(req, res);
    }
);

router.get(
    endpoints.get_all_api_keys,
    rateLimiter,
    async (_req: Request, res: Response) => {
        await getAllApiKeys(res);
    }
);

router.delete(
    endpoints.delete_api_key,
    rateLimiter,
    async (req: Request, res: Response) => {
        await deleteApiKey(req, res);
    }
);

//BYBIT
router.get(
    endpoints.get_fee_rate_spot_bybit,
    rateLimiter,
    async (req: Request, res: Response) => {
        await getFeeRateSpot(req, res);
    }
);

router.get(
    endpoints.get_instruments_info_bybit,
    rateLimiter,
    async (req: Request, res: Response) => {
        await getInstrumentInfo(req, res);
    }
);

router.get(
    endpoints.get_wallet_balance_spot_bybit,
    rateLimiter,
    withCheckApiKeys('bybit1'),
    async (req: Request, res: Response) => {
        await getWalletBalanceSpot(req, res);
    }
);

router.post(
    endpoints.place_buy_order_spot_bybit,
    rateLimiter,
    withCheckApiKeys('bybit'),
    async (req: Request, res: Response) => {
        await placeBuyOrder(req, res);
    }
);

//Public endpoints
router.post(
    endpoints.register_user,
    rateLimiter,
    async (req: Request, res: Response) => {
        await userRegister(req.body, 'user', res);
    }
);

router.post(
    endpoints.login_user,
    rateLimiter,
    async (req: Request, res: Response) => {
        await userLogin(req.body, 'user', res);
    }
);

router.post(
    endpoints.logout,
    rateLimiter,
    async (_req: Request, res: Response) => {
        await userLogout(res);
    }
);

router.post(
    endpoints.login_admin,
    rateLimiter,
    async (req: Request, res: Response) => {
        await userLogin(req.body, 'admin', res);
    }
);

router.put(
    endpoints.refresh_tokens,
    rateLimiter,
    async (req: Request, res: Response) => {
        await refresh(req, res);
    }
);

//Protected public endpoints
router.get(
    endpoints.profile_user,
    rateLimiter,
    withAuth,
    withCheckRole(['user']),
    async (_req: Request, res: Response) => {
        return res.json('hi');
    }
);

// STRATEGY
router.get(
    endpoints.get_coin_strategy,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        await getStrategyFromDb(req, res);
    }
);

router.post(
    endpoints.set_coin_strategy,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        await setStrategyToDb(req, res);
    }
);

router.delete(
    endpoints.delete_coin_strategy,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        await deleteStrategyFromDb(req, res);
    }
);

router.get(
    endpoints.get_all_coin_strategy,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await getAllStrategiesFromDb(res);
    }
);

router.delete(
    endpoints.delete_all_coin_strategy,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await deleteAllStrategiesFromDb(res);
    }
);

// STEPS
router.post(
    endpoints.set_current_step,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        await setCurrentStep(req, res);
    }
);

router.get(
    endpoints.get_current_step,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        await getCurrentStep(req, res);
    }
);

router.delete(
    endpoints.delete_current_step,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        await deleteCurrentStep(req, res);
    }
);

// ORDERS
router.post(
    endpoints.add_order,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        await addOrder(req, res);
    }
);

// router.get(
//   endpoints.get_current_step,
//   rateLimiter,
//   withAuth,
//   async (req: Request, res: Response) => {
//       await getCurrentStep(req, res);
//   }
// );

router.get(
    endpoints.get_all_orders,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await getAllOrders(res);
    }
);

router.delete(
    endpoints.delete_all_orders,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await deleteAllOrders(res);
    }
);

//Admin endpoints
router.post(
    endpoints.register_admin,
    rateLimiter,
    async (req: Request, res: Response) => {
        await userRegister(req.body, 'admin', res);
    }
);

router.post(
    endpoints.add_valid_coin,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        await addValidCoin(req, res);
    }
);

router.get(
    endpoints.get_valid_coins,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await getValidCoins(res);
    }
);

router.get(
    endpoints.get_users,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await getUsers(res);
    }
);

//Temporary endpoints
router.get(
    endpoints.get_tokens,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await getTokens(res);
    }
);

router.delete(
    endpoints.delete_tokens,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        await deleteTokens(res);
    }
);

router.delete(
    endpoints.delete_users,
    rateLimiter,
    withAuth,
    async (_req: Request, res: Response) => {
        await deleteUsers(res);
    }
);
