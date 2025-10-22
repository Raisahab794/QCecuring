const mongoose = require('mongoose');

// Suppress strictQuery deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Add connection options for better resilience
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('MongoDB Atlas Connected');
    
    // Log the connection details for verification
    const { host, port, name } = mongoose.connection;
    console.log(`Connected to database: ${name} at ${host}:${port}`);
    
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    
    // If the error is related to IP whitelisting, log a clearer message
    if (error.message.includes('IP address')) {
      console.error('This appears to be an IP whitelist issue. Check MongoDB Atlas Network Access settings.');
      console.error(`Current server: ${require('os').hostname()}`);
    }
    
    // Try again after a delay
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
