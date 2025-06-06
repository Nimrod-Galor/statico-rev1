import passport from 'passport'
import jwt from 'jsonwebtoken'
import { updateRow, findUnique } from '../../db.js'
import { createUser, generateToken, generateRefreshToken } from '../utils/index.js'
import { sendResetPasswordMail, sendVerificationMail } from '../utils/sendMail.js'
import bcrypt from 'bcryptjs'

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET
const JWT_SECRET = process.env.JWT_SECRET

/** Create User */
export async function createUserController(req, res){
    try{
        const userData = {
            userName: req.parsedData.userName,
            email: req.parsedData.email,
            password: req.parsedData.password,
            role: req.parsedData.role,
            // emailVerified: req.parsedData.verifyEmail
        }

        // Create User
        const response = await createUser(userData)

        res.status(response.statusCode).json(response)

        // If user was created successfully, send verification email
        if(response.status === 'success'){
            //  Get user data
            const {email, userName, verificationToken} = response.data
            const host = req.hostname
            //  Send verification email
            sendVerificationMail(email, userName, host, verificationToken)
        }
    }catch(errorMsg){
        res.status(500).json( { status: 'failed', message: errorMsg.message })
    }
}

// login
export const loginController = (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err){
            return res.status(500).json({ message: 'Server error.' })
        }

        if (!user){
            return res.status(401).json({ message: info.message })
        }

        const { role, userName, id } = {...user, role: user.role.name}

        // Generate new refresh token
        const refreshToken = generateRefreshToken(role, userName, id)

        await updateRow('user', // contentType
            { id }, // where
            { refreshToken } // data
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        // Generate new access token
        const accessToken = generateToken(role, userName, id)

        res.status(200).json({ status: 'success', role, userName, userId: id, accessToken });
            
    })(req, res, next)
}


// Logout
export async function logoutController (req, res){
    const token = req.cookies.refreshToken
    if (!token){
        return res.sendStatus(204)
    }

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
        const accessToken = generateToken( decoded.role, decoded.userName, decoded.id)

        const { role, userName, id } = { ...decoded }

        res.status(200).json({ status: 'success', role, userName, userId: id, accessToken });
            
        // res.status(200).json({ accessToken })
    }catch(err){
        console.log(err)
        return res.status(403).json({err});
    }
}


/*  verify Email  */
export async function verifyEmail(req, res, next){
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUnique('user', { email: decoded.email });

        if (!user || user.verificationToken !== token || user.verificationTokenExpires < Date.now()) {
            return res.ststua(400).json({ status: 'failed', message: 'Invalid or expired token' } )
        }

        const tmpUser = {
            emailVerified: true,
            verificationToken: undefined,
            verificationTokenExpires: undefined
        }

        await updateRow('user', { id: user.id }, tmpUser)

        // Send Success json
        res.json({ status: 'success', message: `Email verified successfully` })
    } catch (error) {
        res.status(500).json({ status: 'failed', message: `Email verified Error` })
    }
}

/*  forgot password */
// check if user exist by email
// if user exist, generate a JWT token with expiration and send it to the user email
// the token will be used to reset the password
export async function forgotPassword(req, res, next){
    try{
        //  Get user email
        const { email } = req.parsedData
        const user = await findUnique('user', { email })

        if(!user){
            return res.status(400).json({ status: 'failed', message: 'Incorrect E-mail addres'})
        }

        // Generate JWT token with expiration
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ status: 'success', message: `Password reset email sent to: "${user.email}"` })

        // Send email with reset link containing the token
        sendResetPasswordMail(user.email, user.userName, resetToken, req.hostname)
    }catch(err){
        res.status(500).json({ status: 'failed', message: 'Server error' })
    }
}

/* Reset Password */
export async function resetPassword(req, res, next){
    //  Get user data
    const { password } = req.parsedData
    const { token } = req.params;

    if(!password){
        return res.status(400).json({ status: 'failed', message: 'Password is required' })
    }

    if(!token){
        return res.status(400).json({ status: 'failed', message: 'Token is required' })
    }

    try{
        // Verify token without needing to check a database
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await findUnique('user', { id: userId } )
        if (!user) {
            return res.status(400).json({ status: 'failed', message: 'User not found' })
        }

        // Hash passowrd
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        //  Set new user object
        const tmpUser = {
            password: hash,
            salt
        }

        //  Update user
        await updateRow('user', { id: userId }, tmpUser)

        // Send Success json
        res.json({ status: 'success', message: `Password ${user.userName} was successfuly updated` })
    }catch(err){
        res.status(500).json({ status: 'failed', message: 'Server error' })
    }
}
