import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/crudController.js';

const router = express.Router();


// Route to get all products
router.get('/:contentType', getProducts);

// Route to get a product by ID
router.get('/:contentType/:id', getProductById);

// Route to create a new product
router.post('/:contentType', createProduct);

// Route to update a product by ID
router.put('/:contentType/:id', updateProduct);

// Route to delete a product by ID
router.delete('/:contentType/:id', deleteProduct);




export default router;