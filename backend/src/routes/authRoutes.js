import express from 'express';
import passport from 'passport';

import { createUserController, localLoginController, logoutController, refreshJwtController } from '../controllers/authController.js'

const router = express.Router();

/*  Signup  */
router.post('/signup', createUserController)

// Local login
router.post('/login', localLoginController);

// Logout
router.post('/logout', logoutController);

// Refresh jwt Token
router.post('/refresh-jwt-token', refreshJwtController);

// Facebook auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    refreshJwtController
);

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    refreshJwtController
);

export default router;
