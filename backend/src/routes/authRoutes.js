import express from 'express'
import passport from 'passport'
import { formValidation } from '../middlewares/formValidation.js'
import { userSchema } from '../../../shared/schemas/user.schema.ts'
import { emailSchema } from '../../../shared/schemas/email.schema.ts'
import { passwordSchema } from '../../../shared/schemas/password.schema.ts'
import { loginSchema } from '../../../shared/schemas/login.schema.ts'

import { createUserController, logoutController, refreshJwtTokenController, loginController, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js'


const router = express.Router()

/*  Signup  */
router.post('/signup', formValidation(userSchema), createUserController)

// Local login
router.post('/login', formValidation(loginSchema), loginController)

// Logout
router.get('/logout', logoutController)

// Refresh jwt Token
router.get('/refresh-token', refreshJwtTokenController)

// Facebook auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    loginController
)

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    loginController
)

// verify Email
router.get('/verify-email/:token', verifyEmail)

// Forgot Password
router.post('/forgot-password', formValidation(emailSchema), forgotPassword)

// Reset Password
router.post('/reset-password/:token', formValidation(passwordSchema), resetPassword)

export default router;
