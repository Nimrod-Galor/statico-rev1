import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { readRow, createRow, findUnique } from "../../db.js"

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET

/** Create User */
export async function createUser(data){
    let {email, userName, password, role, facebookId, googleId} = {...data}

    try{
        // check if user exist
        const userExist = await findUnique('user', //collectionName
            {email}, //where, 
            {email:true} //select
        )
        
        if(userExist){
            return { status: 'failed', statusCode: 409, message: `email '${userExist.email}' already exists.` }
        }

        // set user role if undefind
        if(role == undefined){
            // no role selected, get default role
            const defaultRole = await readRow('role', {
                select: {id: true},
                where: {default: true}
            })
            
            role = defaultRole.id
        }

        // Hash passowrd
        const salt = await bcrypt.genSalt(12); // generate unique salt
        const hashed = await bcrypt.hash(password, salt);

        // Set token and expiration date
        const verificationTokenExpires = new Date(Date.now() + 3600000) // 1 hour
        const userData = {
            email,
            userName,
            password : hashed,
            salt : salt.toString('hex'),
            role : {
                connect: {id: role}
            },
            verificationToken : jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' }),
            verificationTokenExpires : verificationTokenExpires,
            ...(facebookId ? { facebookId } : {}), // only include if truthy
            ...(googleId ? { googleId } : {}) // only include if truthy
        }

        // if created with facebook login add facebook id
        // if(facebookId !== undefined){
        //     userData.facebookId = facebookId
        // }

        // if created with google login add google id
        // if(googleId !== undefined){
        //     userData.googleId = googleId
        // }
        
        // Create User
        const newObject = await createRow('user', userData)

        return { status: 'success', statusCode: 201, message: `user '${userData.userName}' was created.` }
    }catch(err){
        throw err
    }
}

// Create JWT token and refresh Token
export function generateToken(role, userName, id){
    const accessToken = jwt.sign(
        { role, userName, id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    return accessToken
}

// Create JWT refresh Token
export function generateRefreshToken(role, userName, id){
    const refreshToken = jwt.sign(
        { role, userName, id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    return refreshToken;
}