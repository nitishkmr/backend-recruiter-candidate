const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { apply, deleteApplication } = require('../controllers/appliedJobsController');
const { getDashboard } = require('../controllers/candidateController');

router.get('/dashboard', protect, getDashboard);
router.post('/apply', protect, apply);
router.delete('/delete-application', protect, deleteApplication);

module.exports = router;
