import jwt from 'jsonwebtoken';
import { updateRow } from '../../db.js';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET

export function generateTokens(user){
    const accessToken = jwt.sign(
        { id: user.id, roleId: user.roleId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    return { accessToken, refreshToken };
}

export async function createJwtToken(req, res) {
    const user = req.user;

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in DB
    await updateRow(
        'user', // contentType
        { id: user.id }, // where
        { refreshToken } // data
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
}