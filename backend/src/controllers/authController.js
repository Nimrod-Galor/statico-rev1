import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { createUser } from '../utils/index.js'

/** Create User */
export async function createUserController(req, res, next){
    try{
        // Create User
        const response = await createUser(req.body)

        res.status(response.statusCode).json(response)
    }catch(errorMsg){
        res.status(500).json( { status: 'failed', message: errorMsg.message })
    }
}

// Local Login 
export async function localLoginController(req, res){
    passport.authenticate('local', { session: false }), 
    createJwtToken
}

// Logout
export async function logoutController (req, res){
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
}

// refresh JWT token
export async function refreshJwtController(req, res){
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

        res.json({ status: 'success', accessToken });
    } catch (err) {
        return res.sendStatus(403);
    }
}

