const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getDashboard, postJob, makeDecision } = require('../controllers/recruiterController');

router.get('/dashboard', protect, getDashboard);
router.post('/post-job', protect, postJob);
router.post('/decision', protect, makeDecision);

module.exports = router;
