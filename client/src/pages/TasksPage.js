import React, { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks(currentPage, 5, searchTerm);
      setTasks(data.tasks);
      setTotalPages(data.pagination.pages);
      setTotalTasks(data.pagination.total);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);
  
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  const handleCreateClick = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditClick = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
    }
  };
  
  const handleTaskSubmit = async (taskData) => {
    try {
      if (currentTask) {
        await updateTask(currentTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      setError('Failed to save task. Please check your inputs and try again.');
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Search is handled via the useEffect dependency on searchTerm
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="tab-navigation">
        <button 
          className={activeTab === 'tasks' ? 'active' : ''} 
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => window.location.href = '/logs'}
        >
          Audit Logs
        </button>
      </div>
      
      <div className="action-header">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </form>
        </div>
        
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Task
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td className="id-column">#{1000 + index}</td>
                    <td>{task.title}</td>
                    <td>{task.description.length > 50 
                      ? `${task.description.substring(0, 50)}...` 
                      : task.description}
                    </td>
                    <td>
                      <div className="date-column">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(task.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-dark"
                          onClick={() => handleEditClick(task)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteClick(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="pagination">
          <div>Showing {tasks.length} of {totalTasks} tasks</div>
          <div className="page-controls">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <div className="current-page">Page {currentPage}</div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskSubmit}
        task={currentTask}
      />
    </div>
  );
};

export default TasksPage;
