/**
 * Sanitizes user input to prevent XSS attacks
 * @param {Object} data - Object containing user input
 * @returns {Object} - Sanitized object
 */
const sanitizeInput = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Simple HTML tag removal
      sanitized[key] = value
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

module.exports = {
  sanitizeInput
};
