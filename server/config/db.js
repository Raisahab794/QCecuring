const mongoose = require('mongoose');

// Suppress strictQuery deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Remove the 'directConnection' option which is incompatible with SRV URIs
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
      // directConnection: true - REMOVED this line as it's causing the error
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
