import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/crudController.js';
import { dbInterface } from '../prisma/dbInterface.js';


const router = express.Router();


// Route to get all contentTypes
router.get('/categories', async (req, res) => {
    try {
        const categories = Object.keys(dbInterface)
        res.status(200).json({ status: "success", data: categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: "Error fetching categories" });
    }
});

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