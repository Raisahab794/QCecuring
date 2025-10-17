const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');

// Apply authentication middleware
router.use(auth);

// Log routes
router.get('/', logController.getLogs);

module.exports = router;
