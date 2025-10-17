/**
 * Validates task data
 * @param {Object} task - Task object to validate
 * @returns {Array} - Array of validation errors
 */
const validateTask = (task) => {
  const errors = [];
  
  // Validate title
  if (!task.title) {
    errors.push('Title is required');
  } else if (task.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  // Validate description
  if (!task.description) {
    errors.push('Description is required');
  } else if (task.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  return errors;
};

module.exports = {
  validateTask
};
