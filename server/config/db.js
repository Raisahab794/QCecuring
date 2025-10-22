const mongoose = require('mongoose');

// Suppress strictQuery deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Add more connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      // Add this to ensure we connect to the primary
      readPreference: 'primary',
      directConnection: true
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('MongoDB Atlas Connected Successfully!');
    
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    console.error('This appears to be an IP whitelist issue. Check MongoDB Atlas Network Access settings.');
    console.error(`Current server: ${require('os').hostname()}`);
    
    // Try again after a delay
    console.log('Attempting to reconnect in 10 seconds...');
    setTimeout(() => {
      connectDB();
    }, 10000);
  }
};

module.exports = connectDB;
