import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import path from 'path';
import { fileURLToPath } from 'url';

import passport from 'passport';
import './config/passport.js'; // initializes all strategies

// Routes
import authRoutes from './routes/authRoutes.js';
import crudRoutes from './routes/crudRoutes.js';

const app = express();

const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init Passport
app.use(passport.initialize());

app.use(morgan('dev'));


const corsOptions ={
    origin: 'http://localhost:5173',  // react app
    credentials:true,            //access-control-allow-credentials:true
    // optionSuccessStatus:200
}
app.options('/', cors(corsOptions)) // include before other routes
app.use(cors(corsOptions))


// Auth Routes
app.use('/api/v1/auth/', authRoutes);

// API Routes
app.use('/api/v1/', crudRoutes);

// Serve Admin React frontend
app.use('/admin', express.static(path.join(__dirname, '../../backend/admin-client/dist')));

app.get('/admin/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../backend/admin-client/dist', 'index.html'));
});


// Serve React frontend
// app.use(express.static(path.join(__dirname, '../../backend/admin-client/dist')));





// app.use('/admin', express.static(path.join(__dirname, '../../backend/admin-frontend/dist'))) // Serve the adiministrator static files from the React app
// app.use('/', express.static(path.join(__dirname, '../../backend/admin-frontend/dist'))) // Serve the adiministrator static files from the React app

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})