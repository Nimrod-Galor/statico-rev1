import express from 'express';
import morgan from 'morgan';
import cros from 'cors';

import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cros())

// Routes
app.use('/api/products', productRoutes);


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})