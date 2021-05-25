const express = require('express');
const router = express.Router();
const {} = require('../controllers/userController');
const protectRecruiter = require('../middleware/authMiddleware');

router.post('/');
router.post('/login');
router.get('/dashboard', protectRecruiter);

module.exports = router;
