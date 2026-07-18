/**
 * Format a success response
 */
const formatResponse = (data, message = 'Success') => ({
  status: 'success',
  message,
  data,
});

/**
 * Format an error response
 */
const formatError = (message, statusCode = 500) => ({
  status: 'error',
  statusCode,
  message,
});

/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

module.exports = { formatResponse, formatError, generateSlug };
