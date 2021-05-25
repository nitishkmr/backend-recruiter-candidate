const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const { postJob, decision } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboard);
router.post('/post-job', protect, postJob);
router.post('/decision', protect, decision);

module.exports = router;
