const mongoose = require('mongoose');
const Task = require('../models/Task');
const Log = require('../models/Log');
const { validateTask } = require('../utils/validate');
const { sanitizeInput } = require('../utils/sanitize');

// Get all tasks with pagination and search
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (req.query.search) {
      const search = req.query.search;
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Task.countDocuments(query);
    
    res.json({
      tasks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error occurred while fetching tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const sanitizedData = sanitizeInput(req.body);
    const errors = validateTask(sanitizedData);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const newTask = new Task({
      title: sanitizedData.title,
      description: sanitizedData.description
    });
    
    const savedTask = await newTask.save();
    
    await Log.create({
      action: 'Create Task',
      taskId: savedTask._id,
      updatedContent: {
        title: savedTask.title,
        description: savedTask.description
      }
    });
    
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error occurred while creating task' });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const sanitizedData = sanitizeInput(req.body);
    const errors = validateTask(sanitizedData);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const updatedContent = {};
    if (task.title !== sanitizedData.title) updatedContent.title = sanitizedData.title;
    if (task.description !== sanitizedData.description) updatedContent.description = sanitizedData.description;
    
    task.title = sanitizedData.title;
    task.description = sanitizedData.description;
    task.updatedAt = Date.now();
    
    const updatedTask = await task.save();
    
    if (Object.keys(updatedContent).length > 0) {
      await Log.create({
        action: 'Update Task',
        taskId: updatedTask._id,
        updatedContent
      });
    }
    
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Server error occurred while updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      await Task.findByIdAndDelete(taskId);
      
      await Log.create({
        action: 'Delete Task',
        taskId: taskId,
        updatedContent: {
          title: task.title,
          description: task.description
        }
      });
      
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      throw err;
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Server error occurred while deleting task' });
  }
};
