import express from 'express';
import morgan from 'morgan';
import cros from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import passport from 'passport';
import './config/passport.js'; // initializes all strategies

// Routes
import authRoutes from './routes/auth.js';
import crudRoutes from './routes/crudRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init Passport
app.use(passport.initialize());

app.use(morgan('dev'));
app.use(cros())

// Auth Routes
app.use('/auth', authRoutes);

// API Routes
app.use('/api/v1/', crudRoutes);

// Serve Admin React frontend
app.use('/admin', express.static(path.join(__dirname, '../../backend/admin-client/dist')));

// app.get('/admin/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../backend/admin-client/dist', 'index.html'));
// });


// Serve React frontend
// app.use(express.static(path.join(__dirname, '../../backend/admin-client/dist')));





// app.use('/admin', express.static(path.join(__dirname, '../../backend/admin-frontend/dist'))) // Serve the adiministrator static files from the React app
// app.use('/', express.static(path.join(__dirname, '../../backend/admin-frontend/dist'))) // Serve the adiministrator static files from the React app

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})