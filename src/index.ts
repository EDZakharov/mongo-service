import bodyParser from 'body-parser';
import { consola } from 'consola';
import cors from 'cors';
import express, { Express } from 'express';
import { connect } from 'mongoose';
import passport from 'passport';
import { config } from './config';
import { passportConfig } from './middlewares/passportConfig';
import { router } from './routes/routes';

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
passportConfig(passport);
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
