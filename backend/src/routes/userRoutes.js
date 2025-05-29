import express from 'express'
import { formValidation } from '../middlewares/formValidation.js'
import {userSchema } from '../../../shared/schemas/user.schema.ts'
import {userEditSchema } from '../../../shared/schemas/user.schema.ts'
import { createUser, updateUser, deleteUser } from '../controllers/userController.js'
import passport from 'passport'

const router = express.Router()

// create user
router.post('/', passport.authenticate('jwt', { session: false }), formValidation(userSchema), createUser)

// update user
router.put('/:userId', passport.authenticate('jwt', { session: false }), formValidation(userEditSchema), updateUser)

// delete user
router.delete('/:userId', passport.authenticate('jwt', { session: false }), deleteUser)

export default router