const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB Atlas Connected');
    
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    
    if (error.message.includes('IP address')) {
      console.error('This appears to be an IP whitelist issue. Check MongoDB Atlas Network Access settings.');
      console.error(`Current server: ${require('os').hostname()}`);
    }
    
    setTimeout(() => {
      connectDB();
    }, 10000);
  }
};

module.exports = connectDB;
