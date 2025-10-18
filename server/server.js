const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Basic security middleware
app.use(helmet()); // Security headers
app.use(xss()); // Sanitize inputs

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server error occurred' : err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
