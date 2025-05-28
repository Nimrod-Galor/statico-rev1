import express from 'express'
import { getItems, createItem, updateItem, deleteItem, getItemById, getConyectTypes, getTotalPages } from '../controllers/crudController.js'
import { formValidation } from '../middlewares/formValidation.js'
import {userSchema } from '../../../shared/schemas/user.schema.ts'
import {userEditSchema } from '../../../shared/schemas/user.schema.ts'
import { createUser, updateUser } from '../controllers/userController.js'
import passport from 'passport';

const router = express.Router();

// Route to get all contentTypes
router.get('/contentType', passport.authenticate('jwt', { session: false }), getConyectTypes);

// Count total item pages for a contentType
router.get('/:contentType/totalPages', getTotalPages);

// Route to get all Items
router.get('/:contentType', getItems);

// Route to get a Item by ID
router.get('/:contentType/:id', getItemById);

// Route to create and update User. are a special case because of user validation logic
router.post('/user', passport.authenticate('jwt', { session: false }), formValidation(userSchema), createUser);
router.put('/user/:userId', passport.authenticate('jwt', { session: false }), formValidation(userEditSchema), updateUser);

// Route to create a new Item
router.post('/:contentType', passport.authenticate('jwt', { session: false }), createItem);

// Route to update a Item by ID
router.put('/:contentType/:id', passport.authenticate('jwt', { session: false }), updateItem);

// Route to delete a Item by ID
router.delete('/:contentType/:id', passport.authenticate('jwt', { session: false }), deleteItem);

export default router;