const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const protectRecruiter = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboard);
router.post('/postjob');
router.post('/login');
router.get('/dashboard', protectRecruiter);

module.exports = router;
