import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { config } from '../config';
import { User } from '../models/usermodel';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.DB_SECRET,
};

export const passportConfig = (passport: PassportStatic) => {
    passport.use(
        new Strategy(options, async (payload, done) => {
            await User.findById(payload.user_id)
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch((_error) => {
                    return done(null, false);
                });
        })
    );
};
