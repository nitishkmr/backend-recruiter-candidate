const express = require('express');
const router = express.Router();
const { loginUser, getDashboard, registerUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/dashboard', protect, getDashboard);

module.exports = router;
