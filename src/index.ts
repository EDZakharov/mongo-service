import mongoose from 'mongoose';
import { findAllUsers } from './users/findAllUsers';

const connectToMongo = function (
    username: string,
    password: string,
    ip: string,
    port: string,
    db?: string
) {
    username = encodeURIComponent(username);
    password = encodeURIComponent(password);

    return async function (
        cb?: Function | Function[],
        args?: any | any[]
    ): Promise<void> {
        try {
            const res = await mongoose.connect(
                `mongodb://${username}:${password}@${ip}:${port}/${db}`
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
            console.log('mongo disconnected!');
            await mongoose.disconnect();
        } catch (error: any) {
            console.log(error);

            console.log({
                statusCode: error.code,
                message: error.codeName,
            });
        }
    };
};
export const mongoSession = connectToMongo(
    'rwuser',
    'readwrite',
    '127.0.0.1',
    // '77.222.43.158',
    '27017',
    'authdb'
);

// mongoSession(addUser, { name: 'mary', age: 26 });
// mongoSession();
// mongoSession([addUser, findAllUsers], [{ name: 'evgen', age: 20 }, {}]);
// mongoSession([findAllUsers]);
// mongoSession(findAllUsers);

// mongoSession([deleteAllUsers]);
mongoSession(findAllUsers);
// mongoSession(findUser, '6594472826d277cb30c61243');
// mongoSession(deleteUser, '659343f7b61dedcfd5996891');
