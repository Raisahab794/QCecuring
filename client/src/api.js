import axios from 'axios';

// Use environment variable for API URL or fall back to localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // For debugging during deployment

// Create axios instance with basic auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('admin:password123')
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log errors or handle specific status codes
    if (error.response && error.response.status === 401) {
      console.error('Authentication error');
      // Handle auth error (redirect to login, etc.)
    }
    return Promise.reject(error);
  }
);

// Tasks API
export const fetchTasks = async (page = 1, limit = 5, search = '') => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    
    const response = await api.get('/tasks', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Logs API
export const fetchLogs = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/logs', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};
