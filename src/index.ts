import bodyParser from 'body-parser';
import { consola } from 'consola';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { connect } from 'mongoose';
import { config } from './config';
import { router } from './routes/routes';

const app: Express = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many requests from this IP, please try again later',
});

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(limiter);
app.use('/api/users', router);

const startApp = async () => {
    try {
        await connect(
            `mongodb://${config.DB_USER_LOGIN}:${config.DB_USER_PASSWORD}@${config.DB_IP}:${config.DB_PORT}/${config.DB_NAME}`
        ).then(async () => {
            consola.success({
                message: `Mongo connected!`,
                badge: true,
            });
        });

        app.listen(config.APP_PORT, () =>
            consola.success({
                message: `Server started on port ${config.APP_PORT}`,
                badge: true,
            })
        );
    } catch (error) {
        consola.error({
            message: `unable to connect with mongodb`,
            badge: true,
        });
        startApp();
    }
};

startApp();
