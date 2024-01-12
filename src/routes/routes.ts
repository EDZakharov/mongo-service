import { Request, Response, Router } from 'express';
import { withAuth } from '../middlewares/auth';
import { withCheckRole } from '../middlewares/checkrole';
import { userLogin } from '../modules/login';
import { refresh } from '../modules/refresh';
import { userRegister } from '../modules/registration';
import { deleteTokens, getTokens } from '../modules/tokens';
import { deleteUsers, getUsers } from '../modules/users';
export const router = Router();

const endpoints = {
    register_user: '/register-user',
    login_user: '/login-user',
    register_admin: '/register-admin',
    login_admin: '/login-admin',
    profile_user: '/profile-user',
    userdata: '/userdata',
    get_users: '/get-users',
    delete_users: '/delete-users',
    get_tokens: '/get-tokens',
    delete_tokens: '/delete-tokens',
    refresh_tokens: '/refresh-tokens',
};

router.post(endpoints.register_user, async (req: Request, res: Response) => {
    await userRegister(req.body, 'user', res);
});
router.post(endpoints.login_user, async (req: Request, res: Response) => {
    await userLogin(req.body, 'user', res);
});

router.post(endpoints.register_admin, async (req: Request, res: Response) => {
    await userRegister(req.body, 'admin', res);
});

router.post(endpoints.login_admin, async (req: Request, res: Response) => {
    await userLogin(req.body, 'admin', res);
});

router.get(endpoints.get_users, async (_req: Request, res: Response) => {
    await getUsers(res);
});

router.delete(endpoints.delete_users, async (_req: Request, res: Response) => {
    await deleteUsers(res);
});

router.get(endpoints.get_tokens, async (_req: Request, res: Response) => {
    await getTokens(res);
});

router.delete(endpoints.delete_tokens, async (_req: Request, res: Response) => {
    await deleteTokens(res);
});

router.put(endpoints.refresh_tokens, async (req: Request, res: Response) => {
    await refresh(req, res);
});

//Protected routes
router.get(
    endpoints.profile_user,
    withAuth,
    withCheckRole(['user']),
    async (_req: Request, res: Response) => {
        // console.log(req);

        // const data = serializeUser(req.user);
        // console.log(data);
        return res.json('hi');
    }
);

// router.get(
//     endpoints.userdata,
//     authenticateUser,
//     checkRole(['user']),
//     async (req, res) => {
//         console.log(req.user);

//         const data = serializeUser(req.user);
//         console.log(data);

//         return res.json('hi');
//     }
// );
