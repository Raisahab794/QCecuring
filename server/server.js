require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Basic security middleware
app.use(helmet()); // Security headers
app.use(xss()); // Sanitize inputs

// Determine client URL based on environment
const clientURL = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_URL || 'https://qcecuring-4.onrender.com'
  : 'http://localhost:3000';

// CORS configuration
app.use(cors({
  origin: [clientURL, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON bodies

// API routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
} else {
  // Handle 404 routes in development
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Resource not found' });
  });
}

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server error occurred' : err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
