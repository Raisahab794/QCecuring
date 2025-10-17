import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (task) {
      // Edit mode - populate form
      setTitle(task.title);
      setDescription(task.description);
    } else {
      // Create mode - reset form
      setTitle('');
      setDescription('');
    }
    setErrors({});
  }, [task, isOpen]);
  
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    
    if (!title.trim()) {
      formErrors.title = 'Title is required';
      isValid = false;
    } else if (title.length > 100) {
      formErrors.title = 'Title cannot exceed 100 characters';
      isValid = false;
    }
    
    if (!description.trim()) {
      formErrors.description = 'Description is required';
      isValid = false;
    } else if (description.length > 500) {
      formErrors.description = 'Description cannot exceed 500 characters';
      isValid = false;
    }
    
    setErrors(formErrors);
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ title, description });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="100"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="500"
              rows="4"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
