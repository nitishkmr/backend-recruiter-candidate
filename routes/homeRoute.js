const express = require('express');
const router = express.Router();
const { getAllOpenJobs } = require('../controllers/jobController');

router.get('', getAllOpenJobs);

module.exports = router;
