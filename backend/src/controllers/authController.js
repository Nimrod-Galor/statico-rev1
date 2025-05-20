import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { readRow, createRow } from "../../db.js"

/** Create User */
export async function createUser(req, res, next){
    let {email, userName, password, role} = {...req.body}
    // req.sendVerificationMail = sendVerificationMail ? sendVerificationMail : true // send verification email by default
    // req.userData.emailVerified = req.userData.emailverified ? req.userData.emailverified : false // email is NOT farified by default

    try{
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

        // Create a verification token
        // we need this variable down in the sendmail middleware.
        // req.verificationToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
        }
        
        // Create User
        const newObject = await createRow('user', userData)

        res.status(201).json({ action: 'create-user', status: 'success', message: `user '${userData.userName}' was created.` })

        // next()
    }catch(errorMsg){
        // dont send varification Email
        // req.sendVerificationMail = false
        //  Send Error json
        res.json( { action: 'create User', status: 'failed', message: errorMsg.message })
    }
}