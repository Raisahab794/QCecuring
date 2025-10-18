import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (task) {
      // Edit mode - populate form
      setTitle(task.title || '');
      setDescription(task.description || '');
    } else {
      // Create mode - reset form
      setTitle('');
      setDescription('');
    }
  }, [task, isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create Task</h2>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Plan sprint backlog"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add scope, owners, and due dates"
                rows="4"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-save" onClick={handleSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
