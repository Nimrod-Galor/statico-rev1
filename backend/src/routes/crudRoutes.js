import express from 'express'
import { getItems, createItem, updateItem, deleteItem, getItemById, getConyectTypes, getTotalPages, uploadFiles } from '../controllers/crudController.js'
import { formValidation } from '../middlewares/formValidation.js'
import passport from 'passport'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


const router = express.Router()

// Route to get all contentTypes
router.get('/contentType', passport.authenticate('jwt', { session: false }), getConyectTypes)

// Count total item pages for a contentType
router.get('/:contentType/totalPages', getTotalPages)

// Route to get all Items
router.get('/:contentType', getItems)

// Route to get a Item by ID
router.get('/:contentType/:id', getItemById)

// Route to upload files for a Item
router.post('/:contentType/:id/upload', passport.authenticate('jwt', { session: false }), upload.array('files', 10), uploadFiles)

// Route to create a new Item
router.post('/:contentType', passport.authenticate('jwt', { session: false }), formValidation(), createItem)

// Route to update a Item by ID
router.put('/:contentType/:id', passport.authenticate('jwt', { session: false }), formValidation(), updateItem)


// Route to delete a Item by ID
router.delete('/:contentType/:id', passport.authenticate('jwt', { session: false }), deleteItem)

export default router