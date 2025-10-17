const basicAuth = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ 
      error: 'Unauthorized access. Authentication required.' 
    });
  }

  // Extract and decode credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Simple static authentication for demo purposes
  // In a real app, you would check against a database
  if (username === 'admin' && password === 'password123') {
    next();
  } else {
    res.status(401).json({ error: 'Invalid authentication credentials.' });
  }
};

module.exports = basicAuth;
