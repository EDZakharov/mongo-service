import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { config } from '../config';
import { User } from '../models/usermodel';

export const userRegister = async (userData: any, role: string, res: any) => {
    try {
        const usernameNotTaken = await validateUsername(userData.username);

        if (usernameNotTaken) {
            console.log('1', usernameNotTaken);
            return res.status(400).json({
                message: `Username ${userData.username} is already taken`,
                success: false,
            });
        }
        const emailNotRegistered = await validateEmail(userData.email);

        if (emailNotRegistered) {
            console.log('2', emailNotRegistered);
            return res.status(400).json({
                message: `Email ${userData.email} is already registered`,
                success: false,
            });
        }

        const password = await bcrypt.hash(userData.password, 12);
        const newUser = new User({
            ...userData,
            password,
            role,
        });
        await newUser.save();
        return res.status(201).json({
            message: 'User was registered',
            success: true,
        });
    } catch (error) {
        //add logger
        return res.status(400).json({
            message: 'Unable to create your account',
            success: false,
        });
    }
};

export const userLogin = async (userCred: any, role: string, res: any) => {
    const { username, password } = userCred;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: 'Username not found',
            success: false,
        });
    }
    if (user.role !== role) {
        return res.status(403).json({
            message:
                'The client does not have permission to access the content',
            success: false,
        });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
        return res.status(403).json({
            message: 'Incorrect password',
            success: false,
        });
    }
    const checkSecret = config.DB_SECRET;
    if (!checkSecret) {
        return res.status(506).json({
            message: 'The server encountered an internal configuration error',
            success: false,
        });
    }
    const token = jwt.sign(
        {
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email,
        },
        checkSecret,
        { expiresIn: '7 days' }
    );

    let result = {
        username: user.username,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168,
    };

    return res.status(200).json({
        ...result,
        message: 'You are now logged in',
        success: true,
    });
};

const validateUsername = async (username: string) => {
    let user = await User.findOne({ username });

    return user ? true : false;
};

const validateEmail = async (email: string) => {
    let user = await User.findOne({ email });

    return user ? true : false;
};

export const authenticateUser = passport.authenticate('jwt', {
    session: false,
});

export const checkRole =
    (roles: string[]) => (req: any, res: any, next: NextFunction) => {
        if (roles.includes(req.user.role)) {
            return next();
        }
        return res
            .status(401)
            .json({ message: 'Unauthorized', success: false });
    };

export const serializeUser = (user: any) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        updateAt: user.updatedAt,
        createAt: user.createdAt,
    };
};
