const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const { postJob } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboard);
router.post('/post-job', protect, postJob);

module.exports = router;
