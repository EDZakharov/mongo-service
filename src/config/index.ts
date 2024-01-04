import dotenv from 'dotenv';
dotenv.config();

export const config = {
    DB_IP: process.env['APP_DB_IP'],
    DB_SECRET: process.env['APP_DB_SECRET'],
    DB_USER_LOGIN: process.env['APP_DB_USER_LOGIN'],
    DB_USER_PASSWORD: process.env['APP_DB_USER_PASSWORD'],
    DB_ROOT_LOGIN: process.env['APP_DB_ROOT_LOGIN'],
    DB_ROOT_PASSWORD: process.env['APP_DB_ROOT_PASSWORD'],
    DB_NAME: process.env['APP_DB_NAME'],
    DB_PORT: process.env['APP_DB_PORT'],
    APP_PORT: process.env['APP_PORT'],
};
