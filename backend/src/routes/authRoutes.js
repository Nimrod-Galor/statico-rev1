import express from 'express';
import passport from 'passport';


import { createUserController, logoutController, refreshJwtTokenController, loginController } from '../controllers/authController.js'

const router = express.Router();

/*  Signup  */
router.post('/signup', createUserController)

// Local login
router.post('/login', passport.authenticate('local', { session: false }), loginController);

// Logout
router.get('/logout', logoutController);

// Refresh jwt Token
router.get('/refresh-token', refreshJwtTokenController);

// Facebook auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    loginController
);

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    loginController
);

export default router;
