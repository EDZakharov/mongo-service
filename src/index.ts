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

            // if (cb && typeof cb === 'function') {
            //     const result = await cb(args);
            //     console.log(result);
            // }

            // if (cb && typeof cb === 'object' && cb.length) {
            //     for (let index = 0; index < cb.length; index++) {
            //         const func = cb[index];
            //         if (!func) return;
            //         const result = await func(
            //             args && !!args.length && args[index]
            //         );
            //         console.log(result);
            //     }
            // }
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

// finally {
//   consola.success({
//       message: `Mongo disconnected!`,
//       badge: true,
//   });
//   await disconnect();
// }
// const connectToMongo = function (
//     username?: string,
//     password?: string,
//     ip?: string,
//     port?: string,
//     db?: string
// ) {
//     return async function (
//         cb?: Function | Function[],
//         args?: any | any[]
//     ): Promise<void> {
//         if (!username || !password || !ip || !port || !db) {
//             return;
//         }
//         try {
//             await connect(
//                 `mongodb://${username}:${password}@${ip}:${port}/${db}`
//             )
//                 .then(async () => {
//                     consola.success({
//                         message: `Mongo connected!`,
//                         badge: true,
//                     });

//                     if (cb && typeof cb === 'function') {
//                         const result = await cb(args);
//                         console.log(result);
//                     }

//                     if (cb && typeof cb === 'object' && cb.length) {
//                         for (let index = 0; index < cb.length; index++) {
//                             const func = cb[index];
//                             if (!func) return;
//                             const result = await func(
//                                 args && !!args.length && args[index]
//                             );
//                             console.log(result);
//                         }
//                     }
//                 })
//                 .catch(() => {
//                     consola.error({
//                         message: `unable to connect with mongodb`,
//                         badge: true,
//                     });
//                 })
//                 .finally(async () => {
//                     consola.success({
//                         message: `Mongo disconnected!`,
//                         badge: true,
//                     });
//                     await disconnect();
//                 });
//         } catch (error: any) {
//             console.log(error);

//             console.log({
//                 statusCode: error.code,
//                 message: error.codeName,
//             });
//         }
//     };
// };
// export const mongoSession = connectToMongo(
//     config.DB_USER_LOGIN,
//     config.DB_USER_PASSWORD,
//     config.DB_IP,
//     // '77.222.43.158',
//     config.DB_PORT,
//     config.DB_NAME
// );

// mongoSession(addUser, { name: 'mary', age: 26 });
// mongoSession();
// mongoSession([addUser, findAllUsers], [{ name: 'evgen', age: 20 }, {}]);
// mongoSession([findAllUsers]);
// mongoSession(findAllUsers);

// mongoSession([deleteAllUsers]);
// mongoSession(findAllUsers);
