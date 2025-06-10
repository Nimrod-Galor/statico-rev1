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

        if (!email || !password) {
            return done(null, false, { message: 'Email and password are required' });
        }

        try {
            const user = await findUnique('user', { email }, { id: true, userName: true, roles: true, salt: true, password: true})

            if (!user){
                console.log("User not found for email:", email);
                return done(null, false, { message: 'Invalid email or password' });
            }

            // Use stored salt to hash the incoming password
            const hashedInput = await bcrypt.hash(password, user.salt)

            if (hashedInput !== user.password){
                return done(null, false, { message: 'Invalid email or password' })
            }

            return done(null, user)
        } catch (err) {
            console.error("Error in Local Strategy:", err);
            return done(err)
        }
    }
))

// JWT Strategy
passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    }, async (payload, done) => {
        try {
            const user = await findUnique('user', { id:payload.id }, {id: true, roles: {select: {name :true} } })
            
            user.roles = user.roles.map(role => role.name) // Convert roles to array of names

console.log("JWT Strategy - User found:", user)

            return done(null, user || false)
        } catch (err) {
            return done(err, false)
        }
    }
))

// JWT Public
// This strategy is used for public routes that do not require authentication
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
};

passport.use('jwt-optional', new JwtStrategy(opts, async (req, payload, done) => {
    if (payload) {
        const user = await findUnique('user', { id:payload.id }, {id: true, roles: {select: {name :true} } })
            
        if(user){
            user.roles = user.roles.map(role => role.name) // Convert roles to array of names
        }
        console.log("JWT Optional Strategy - User found:", user);
        return done(null, user); // Token is valid
    } else {
        return done(null, defaultUser); // Should never reach here, but just in case
    }
}))
// passport.use('jwt-optional', new JwtStrategy({
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: JWT_SECRET,
//         passReqToCallback: true,
//         ignoreExpiration: true, // Ignore expiration for public routes
//     }, async (req, payload, done) => {
//         console.log("JWT Public Strategy - Payload:", payload)
//         try {
//             if (!payload || !payload.id) {
//                 console.log("JWT Public Strategy - No payload or ID found");
//                 return done(null, { roles: ['guest'] }); // Return guest role if no user found
//             }
//             const user = await findUnique('user', { id:payload.id }, {id: true, roles: {select: {name :true} } })
            
//             if(user){
//                 user.roles = user.roles.map(role => role.name) // Convert roles to array of names
//             }

// console.log("JWT  Strategy - User found:", user)
// // Always authenticate, even if user not found
// // If user is not found, return an empty object
//             return done(null, user || {roles: ['guest']})
//         } catch (err) {
//             console.error("Error in JWT Public Strategy:", err);
//             return done(err, false)
//         }
//     }
// ))

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
))

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
))
