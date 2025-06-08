import express from 'express'
import { getItems, createItem, updateItem, deleteItem, getItemById, getConyectTypes, getTotalPages, uploadFiles, deleteFile } from '../controllers/crudController.js'
import { formValidation } from '../middlewares/formValidation.js'
import passport from 'passport'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


const router = express.Router()

// Get all contentTypes
router.get('/contentType', passport.authenticate('jwt', { session: false }), getConyectTypes)

// Count total item pages for a contentType
router.get('/:contentType/totalPages', getTotalPages)

// Get all Items in a contentType
router.get('/:contentType', getItems)

// Get a Item by ID
router.get('/:contentType/:id', getItemById)

// Upload files for a Item
router.post('/:contentType/:id/upload', passport.authenticate('jwt', { session: false }), upload.any(), uploadFiles)

// Delete files for a Item
router.delete('/:contentType/files/:fileId', passport.authenticate('jwt', { session: false }), deleteFile)

// Create Item
router.post('/:contentType', passport.authenticate('jwt', { session: false }), formValidation(), createItem)

// Update a Item by ID
router.put('/:contentType/:id', passport.authenticate('jwt', { session: false }), formValidation(), updateItem)

// Delete a Item by ID
router.delete('/:contentType/:id', passport.authenticate('jwt', { session: false }), deleteItem)

export default router