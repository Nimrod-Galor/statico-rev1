import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { readRow, findUnique } from '../../db.js';

export const preprocessFormData = async (req, res, next ) => {
    const { contentType, id } = req.params

    if(contentType === 'user'){
        delete req.parsedData.rePassword

        if(req.parsedData.roles == undefined){
            // no role selected, get default role
            const defaultRole = await readRow('role', { select: { id: true }, where: { default: true } })

            req.parsedData.roles = { connect: { id: defaultRole.id} }
        }else{
            if(id){
                req.parsedData.roles = { set: req.parsedData.roles.map(roleId => ({ id: roleId })) }
            }else{
                req.parsedData.roles = { connect: req.parsedData.roles.map(roleId => ({ id: roleId })) }
            }
        }

        if(req.parsedData.password && req.parsedData.password != ''){
            // Hash passowrd
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.parsedData.password, salt);
    
            req.parsedData.password = hash
            req.parsedData.salt = salt
        }

        
        if(id){
            // update item
            // check if user exist by id
            const user = await findUnique('user', { id }, { email: true } )
            if(!user){
                res.status(400).json({status: 'failed', message: 'User not found'})
            }

            if(req.parsedData.email != user.email){
                // check if mail exist
                const user = await findUnique('user', { email: req.parsedData.email }, { id: true } )

                if(user && user.id != id){
                    return res.status(400).json({status: 'failed', message: `User with Email "${req.parsedData.email}" already exist.`})
                }

                // email need update. update verified flag
                req.parsedData.emailVerified = req.parsedData.emailVerified ? req.parsedData.emailVerified : false
            }
            
        }else{
            // create item
            // check if user exist by mail
            const user = await findUnique('user', { email: req.parsedData.email }, { id: true, userName:true } )
            if(user){
                return res.status(400).json({status: 'failed', message: `User with Email ${req.parsedData.email} already exist.`})
            }

            // Create a verification token
            // we need this variable down in the sendmail middleware.
            req.parsedData.verificationToken = jwt.sign({ email: req.parsedData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Set token and expiration date
            req.parsedData.verificationTokenExpires = new Date(Date.now() + 3600000) // 1 hour
        }

        console.log("req.parsedData:", req.parsedData)
        
    }

    next()
}