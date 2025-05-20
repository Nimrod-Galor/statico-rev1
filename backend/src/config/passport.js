import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { findUnique } from '../../db.js'

const JWT_SECRET = process.env.JWT_SECRET;// 'your_jwt_secret';

// Local Strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await findUnique('user', { email });
            if (!user) return done(null, false, { message: 'Invalid email or password' });

            // Use stored salt to hash the incoming password
            const hashedInput = await bcrypt.hash(password, user.salt);

            if (hashedInput !== user.password){
                return done(null, false, { message: 'Invalid email or password' });
            }

            // const newPassword = crypto.pbkdf2Sync(password, Buffer.from(user.salt, 'hex'), 100000, 64, 'sha512')
            // const oldPassword = Buffer.from(user.password, 'hex')
            // if (!crypto.timingSafeEqual(oldPassword, newPassword)) {
            //     return done(null, false, { message: 'Invalid email or password' })
            // }

            return done(null, user);

            // if (!user || !(await bcrypt.compare(password, user.password))) {
            //     return done(null, false, { message: 'Invalid credentials' });
            // }
            // return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// JWT Strategy
passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    }, async (payload, done) => {
        try {
            const user = await User.findById(payload.id);
            return done(null, user || false);
        } catch (err) {
            return done(err, false);
        }
    }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
        clientID: 'FACEBOOK_CLIENT_ID',
        clientSecret: 'FACEBOOK_CLIENT_SECRET',
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await findUnique('user', { facebookId: profile.id });
            if (!user) {
                user = await createRow('user', {
                    facebookId: profile.id,
                    email: profile.emails?.[0].value,
                    name: `${profile.name.givenName} ${profile.name.familyName}`
                });
            }
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
));

// Google Strategy
passport.use(new GoogleStrategy({
        clientID: 'GOOGLE_CLIENT_ID',
        clientSecret: 'GOOGLE_CLIENT_SECRET',
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await findUnique('user', { googleId: profile.id });
            if (!user) {
                user = await createRow('user', {
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName
                });
            }
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
));
