import React, { useState, useEffect, useCallback } from 'react';
import { fetchLogs } from '../api';
import { useNavigate } from 'react-router-dom';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLogs(currentPage, 10);
      setLogs(data.logs);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError('Failed to load audit logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);
  
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);
  
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
    const date = new Date(dateString);
    return `${date.toISOString().split('T')[0]} ${date.toTimeString().substring(0, 5)}`;
  };
  
  const getActionClass = (action) => {
    switch (action) {
      case 'Create Task': return 'action-create';
      case 'Update Task': return 'action-update';
      case 'Delete Task': return 'action-delete';
      default: return '';
    }
  };
  
  const renderUpdatedContent = (content) => {
    if (!content) return '-';
    try {
      if (typeof content === 'object') {
        return Object.entries(content)
          .map(([key, value]) => `${key}: "${value}"`)
          .join(', ');
      }
      return String(content);
    } catch (err) {
      return '-';
    }
  };
  
  // Format task ID to be more readable
  const formatTaskId = (id) => {
    if (!id) return '-';
    
    // Make it look like #1234 (take first 4 chars)
    return `#${id.substring(0, 4)}`;
  };
  
  return (
    <div>
      <div className="tab-navigation">
        <button onClick={() => navigate('/')}>Tasks</button>
        <button className="active">Audit Logs</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px', opacity: '0.5'}}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <circle cx="12" cy="13" r="2"></circle>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p>No audit logs found</p>
          <p style={{color: '#94a3b8', fontSize: '14px', marginTop: '8px'}}>
            Logs will appear when you create, update, or delete tasks
          </p>
          <button 
            className="btn btn-create" 
            onClick={() => navigate('/')}
            style={{marginTop: '20px'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create a Task
          </button>
        </div>
      ) : (
        <>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Task ID</th>
                <th>Updated Content</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>
                    <span className={`action-badge ${getActionClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="task-id">{formatTaskId(log.taskId)}</td>
                  <td>{renderUpdatedContent(log.updatedContent)}</td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            <div></div>
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
    </div>
  );
};

export default LogsPage;
