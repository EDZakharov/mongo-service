import mongoose from 'mongoose';
import { findAllUsers } from './users/findAllUsers';

const connectToMongo = function (
    login: string,
    password: string,
    ip: string,
    port: string
) {
    return async function (
        cb?: Function | Function[],
        args?: any | any[]
    ): Promise<void> {
        try {
            const res = await mongoose.connect(
                `mongodb://${login}:${password}@${ip}:${port}`
            );
            if (!res) {
                return;
            }
            console.log('mongo connected!');
            if (cb && typeof cb === 'function') {
                const result = await cb(args);
                console.log(result);
            }

            if (cb && typeof cb === 'object' && cb.length) {
                for (let index = 0; index < cb.length; index++) {
                    const func = cb[index];
                    if (!func) return;
                    const result = await func(
                        args && !!args.length && args[index]
                    );
                    console.log(result);
                }
            }

            await mongoose.disconnect();
            console.log('mongo disconnected!');
        } catch (error: any) {
            console.log({
                statusCode: error.code,
                message: error.codeName,
            });
        }
    };
};
export const mongoSession = connectToMongo(
    'admin',
    'admin123',
    '77.222.43.158',
    '27017'
);

// mongoSession(addUser, { name: 'mary', age: 20 });
// mongoSession();
// mongoSession([addUser, findAllUsers], [{ name: 'evgen', age: 20 }, {}]);
mongoSession([findAllUsers]);
// mongoSession(findAllUsers);

// mongoSession([findAllUsers, deleteAllUsers]);
// mongoSession(findUser, '6594472826d277cb30c61243');
// mongoSession(deleteUser, '659343f7b61dedcfd5996891');
