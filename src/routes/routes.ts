import router from 'express';
import { userRegister } from '../utils/auth';
import { deleteUsers, getUsers } from '../utils/users';
export const rt = router.Router();

const endpoints = {
    register_user: '/register-user',
    login_user: '/login-user',
    register_admin: '/register-admin',
    login_admin: '/login-admin',
    profile: '/profile',
    get_users: '/get-users',
    delete_users: '/delete-users',
};

rt.post(endpoints.register_user, async (req, res) => {
    await userRegister(req.body, 'user', res);
});
// rt.post(endpoints.login_user, async (req, res) => {});

rt.post(endpoints.register_admin, async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

rt.get(endpoints.get_users, async (req, res) => {
    await getUsers(res);
});

rt.delete(endpoints.delete_users, async (req, res) => {
    await deleteUsers(res);
});

// rt.post(endpoints.login_admin, async (req, res) => {});

// rt.post(endpoints.profile, async (req, res) => {});
