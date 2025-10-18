import React, { useState, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';
import TaskModal from '../components/TaskModal';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const navigate = useNavigate();
  
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
  
  // Load tasks when component mounts
  React.useEffect(() => {
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
        loadTasks(); // Reload tasks from API
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Delete error:', err);
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
      loadTasks(); // Reload tasks from API
    } catch (err) {
      setError('Failed to save task. Please check your inputs and try again.');
    }
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      loadTasks();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  // Format task ID to be consistent
  const formatTaskId = (id) => {
    if (!id) return '#0000';
    return `#${id.substring(0, 4)}`;
  };
  
  return (
    <div>
      <div className="tab-navigation">
        <button className="active">Tasks</button>
        <button onClick={() => navigate('/logs')}>Audit Logs</button>
      </div>
      
      <div className="search-actions">
        <div className="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>
        <button className="btn btn-create" onClick={handleCreateClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Task
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px', opacity: '0.5'}}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="12" x2="15" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <p>No tasks found</p>
          <p style={{color: '#94a3b8', fontSize: '14px', marginTop: '8px'}}>Create your first task to get started</p>
          <button 
            className="btn btn-create" 
            onClick={handleCreateClick}
            style={{marginTop: '20px'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Task
          </button>
        </div>
      ) : (
        <>
          <table className="task-table">
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
              {tasks.map(task => (
                <tr key={task._id}>
                  <td className="task-id">{formatTaskId(task._id)}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <div className="date-display">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <button className="btn btn-edit" onClick={() => handleEditClick(task)}>
                        Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => handleDeleteClick(task._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            <div className="task-count">
              Showing {tasks.length} of {totalTasks} tasks
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <div className="page-indicator">Page {currentPage}</div>
              <button 
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
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
