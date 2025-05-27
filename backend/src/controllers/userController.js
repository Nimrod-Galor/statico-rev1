import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { readRow, createRow } from '../../db.js';

export const createUser = async (req, res) => {
    try{
        const userData = {
            userName: req.parsedData.userName,
            email: req.parsedData.email,
            password: req.parsedData.password,
            role: req.parsedData.role,
            // emailVerified: req.parsedData.verifyEmail
        }

        if(userData.role == undefined){
            // no role selected, get default role
            const defaultRole = await readRow('role', {
                select: {id: true},
                where: {default: true}
            })

            userData.role = defaultRole.id
        }else{
            // get role id
            const role = await readRow('role', {
                select: {id: true},
                where: {name: userData.role}
            })

            if(!role){
                // role not found
                return res.status(400).json({success: 'failed', message: `role ${userData.role} does not exist.`})
            }
            
            userData.role = role.id
        }

        // Hash passowrd
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(userData.password, salt);

        // Create a verification token
        // we need this variable down in the sendmail middleware.
        const verificationToken = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token and expiration date
        const verificationTokenExpires = new Date(Date.now() + 3600000) // 1 hour

        userData.password = hash//key.toString('hex')
        userData.salt = salt//salt.toString('hex')
        userData.role = {
            connect: {id: userData.role}
          }
        userData.verificationToken = verificationToken
        userData.verificationTokenExpires = verificationTokenExpires
        
        // Create User
        const newObject = await createRow('user', userData)

        res.status(201).json({ action: 'create-user', status: 'success', message: `user '${userData.userName}' was created.` })
        
        // if(!req.sendVerificationMail){
        // }
        
    }catch(errorMsg){
        res.json( { action: 'create User', status: 'failed', message: errorMsg.message })
    }
}

