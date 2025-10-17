require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Create a simple document in a test collection
    const TestModel = mongoose.model('Test', new mongoose.Schema({ 
      message: String, 
      createdAt: { type: Date, default: Date.now } 
    }));
    
    await TestModel.create({ message: 'Connection test successful' });
    console.log('✅ Test document created successfully');
    
    // Find all documents to verify write operation
    const docs = await TestModel.find();
    console.log('📄 Documents in test collection:', docs);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
