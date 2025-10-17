import React, { useState, useEffect, useCallback } from 'react';
import { fetchLogs } from '../api';
import Pagination from '../components/Pagination';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
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
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get CSS class based on action type
  const getActionClass = (action) => {
    switch (action) {
      case 'Create Task': return 'log-create';
      case 'Update Task': return 'log-update';
      case 'Delete Task': return 'log-delete';
      default: return '';
    }
  };
  
  return (
    <div className="logs-container">
      <div className="page-header">
        <h2>Audit Logs</h2>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <p>No audit logs found.</p>
        </div>
      ) : (
        <div className="logs-list">
          {logs.map(log => (
            <div key={log._id} className={`log-item ${getActionClass(log.action)}`}>
              <div className="log-header">
                <span className="log-time">{formatDate(log.timestamp)}</span>
                <span className="log-action">{log.action}</span>
              </div>
              <div className="log-details">
                <span className="log-task-id">Task ID: {log.taskId}</span>
                {log.updatedContent && (
                  <div className="log-content">
                    <h4>Updated Content:</h4>
                    <pre>{JSON.stringify(log.updatedContent, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default LogsPage;
