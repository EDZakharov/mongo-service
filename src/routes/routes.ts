import { Request, Response, Router } from 'express';
import {
    authenticateUser,
    checkRole,
    serializeUser,
    userLogin,
    userRegister,
} from '../utils/auth';
import { deleteUsers, getUsers } from '../utils/users';
export const router = Router();

const endpoints = {
    register_user: '/register-user',
    login_user: '/login-user',
    register_admin: '/register-admin',
    login_admin: '/login-admin',
    profile: '/profile',
    userdata: '/userdata',
    get_users: '/get-users',
    delete_users: '/delete-users',
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

//Protected routes
router.get(endpoints.profile, authenticateUser, async (req, res) => {
    console.log(req.user);

    const data = serializeUser(req.user);
    console.log(data);
    return res.json('hi');
});

router.get(
    endpoints.userdata,
    authenticateUser,
    checkRole(['user']),
    async (req, res) => {
        console.log(req.user);

        const data = serializeUser(req.user);
        console.log(data);

        return res.json('hi');
    }
);
