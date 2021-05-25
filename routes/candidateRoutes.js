const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { apply } = require('../controllers/appliedJobsController');

router.get('/dashboard', protect, getDashboard);
router.post('/apply', protect, apply);

module.exports = router;
