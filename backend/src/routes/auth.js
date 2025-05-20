import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { updateRow, findUnique } from '../../db.js';
import { createJwtToken, generateTokens } from '../middlewares/createJwtToken.js'
import { createUser } from '../controllers/authController.js'

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET

/*  Signup  */
router.post('/signup', createUser)

// Local login
router.post('/login', 
    passport.authenticate('local', { session: false }), 
    createJwtToken
);

// Logout
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    await updateRow('user', // contentType
      { id: decoded.id }, // where
      { refreshToken: null } // data
    );
  } catch {}

  res.clearCookie('refreshToken');
  res.sendStatus(204);
});


// Refresh jwt Token
router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await findUnique('user', { id: decoded.id });

    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    // Generate new access + refresh tokens
    const { accessToken, refreshToken: newRefresh } = generateTokens(user);

    await updateRow('user', // contentType
      { id: user.id }, // where
      { refreshToken: newRefresh } // data
    );

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
});

// JWT protected route
// router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json(req.user);
// });

// Facebook auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    createJwtToken
);

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    createJwtToken
);

export default router;
