import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'

import passport from 'passport'
import './config/passport.js' // initializes all strategies

// Routes
import authRoutes from './routes/authRoutes.js'
import crudRoutes from './routes/crudRoutes.js'

const app = express()

const PORT = process.env.PORT || 3000


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// init Passport
app.use(passport.initialize())

app.use(morgan('dev'))


const corsOptions ={
    origin: 'http://localhost:5173',  // react app
    credentials:true,            //access-control-allow-credentials:true
    // optionSuccessStatus:200
}
app.options('/', cors(corsOptions)) // include before other routes
app.use(cors(corsOptions))

// Serve static files from the "uploads" directory
if (!fs.existsSync('uploads')){
  fs.mkdirSync('uploads')
}


// Auth Routes
app.use('/api/v1/auth/', authRoutes)

// API Routes
app.use('/api/v1/', crudRoutes)

// Serve Admin React frontend
app.use('/admin/', express.static(path.join(__dirname, '../../admin-client/dist')))

app.get('/admin/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../admin-client/dist', 'index.html'))
});

// Serve files
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});


// Serve front end static files
app.use('/', express.static(path.join(__dirname, '../../frontend/dist')))

// Catch-all route to serve the frontend app
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'))
})


// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({
    url: req.originalUrl,
    status: 'error',
    message: 'Not Found'
  });
})



app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})