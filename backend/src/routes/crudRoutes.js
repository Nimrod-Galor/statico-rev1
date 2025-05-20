import express from 'express';
import { getItems, createItem, updateItem, deleteItem, getItemById, getConyectTypes, getTotalPages } from '../controllers/crudController.js';


const router = express.Router();

// Route to get all contentTypes
router.get('/contentType', getConyectTypes);

// Count total item pages for a contentType
router.get('/:contentType/totalPages', getTotalPages);

// router.get('/:contentType/schema', getContentTypeSchema)


// Route to get all Items
router.get('/:contentType', getItems);

// Route to get a Item by ID
router.get('/:contentType/:id', getItemById);

// Route to create a new Item
router.post('/:contentType', createItem);

// Route to update a Item by ID
router.put('/:contentType/:id', updateItem);

// Route to delete a Item by ID
router.delete('/:contentType/:id', deleteItem);


export default router;