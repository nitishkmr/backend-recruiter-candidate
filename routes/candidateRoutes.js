const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { apply } = require('../controllers/appliedJobsController');
const { getDashboard } = require('../controllers/candidateController');

router.get('/dashboard', protect, getDashboard);
router.post('/apply', protect, apply);

module.exports = router;
