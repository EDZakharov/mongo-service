import { Request, Response, Router } from 'express';
import { withAuth } from '../middlewares/auth';
import { withCheckRole } from '../middlewares/checkrole';
import { rateLimiter } from '../middlewares/rateLimiter';
import { addValidCoin, getValidCoins } from '../modules/coins';
import { userLogin } from '../modules/login';
import { userLogout } from '../modules/logout';
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
};

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
        getStrategyFromDb(req, res);
    }
);

router.post(
    endpoints.set_coin_strategy,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        setStrategyToDb(req, res);
    }
);

router.delete(
    endpoints.delete_coin_strategy,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        deleteStrategyFromDb(req, res);
    }
);

router.get(
    endpoints.get_all_coin_strategy,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        getAllStrategiesFromDb(res);
    }
);

router.delete(
    endpoints.delete_all_coin_strategy,
    rateLimiter,
    // withAuth,
    async (_req: Request, res: Response) => {
        deleteAllStrategiesFromDb(res);
    }
);

// STEPS
router.post(
    endpoints.set_current_step,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        console.log('Setstep');

        setCurrentStep(req, res);
    }
);

router.get(
    endpoints.get_current_step,
    rateLimiter,
    withAuth,
    async (req: Request, res: Response) => {
        getCurrentStep(req, res);
    }
);

router.delete(
    endpoints.delete_current_step,
    rateLimiter,
    // withAuth,
    async (req: Request, res: Response) => {
        deleteCurrentStep(req, res);
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
    withAuth,
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
