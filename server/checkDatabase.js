require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const Log = require('./models/Log');

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Check for tasks
    const taskCount = await Task.countDocuments();
    console.log(`Number of tasks in database: ${taskCount}`);

    // Display all tasks
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log('\nTasks:');
    tasks.forEach(task => {
      console.log(`- ${task._id}: ${task.title}`);
      console.log(`  Description: ${task.description}`);
      console.log(`  Created: ${task.createdAt}`);
      console.log('-------------------');
    });

    // Check for audit logs
    const logCount = await Log.countDocuments();
    console.log(`\nNumber of audit logs in database: ${logCount}`);

    // Display recent logs
    const logs = await Log.find().sort({ timestamp: -1 }).limit(5);
    console.log('\nRecent Logs:');
    logs.forEach(log => {
      console.log(`- ${log.action} (${new Date(log.timestamp).toLocaleString()})`);
      console.log(`  Task ID: ${log.taskId}`);
      console.log('-------------------');
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
