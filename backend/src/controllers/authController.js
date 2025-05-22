import jwt from 'jsonwebtoken'
import { updateRow } from '../../db.js'
import { createUser, generateToken, generateRefreshToken } from '../utils/index.js'

// const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;// 'your_jwt_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET

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

// login
export const loginController = async (req, res) => {
    try {
        const user = req.user

        // Generate new refresh token
        const refreshToken = generateRefreshToken(user.id)

        await updateRow('user', // contentType
            { id: user.id }, // where
            { refreshToken } // data
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Generate new access token
        const accessToken = generateToken(user.id)

        const { role, userName } = {...user, role: user.role.name}

        res.json({ status: 'success', role, userName, accessToken });
    } catch (err) {
        console.log(err)
        return res.status(403).json({err});
    }
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
export function refreshJwtTokenController(req, res){
    const token = req.cookies.refreshToken;
    
    if (!token){
        return res.sendStatus(401)
    }

    try{
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)
        const accessToken = generateToken(decoded.id)
        res.status(200).json({ accessToken })
    }catch(err){
        console.log(err)
        return res.status(403).json({err});
    }

}
