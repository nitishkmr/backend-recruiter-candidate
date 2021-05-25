const express = require('express');
const router = express.Router();
const Job = require('../models/jobModel');
const asyncHandler = require('express-async-handler');

router.get(
  '',
  asyncHandler(async (req, res) => {
    const jobs = await Job.find({ isActive: true });
    if (jobs.length > 0) {
      res.json({ jobs });
    } else {
      res.status(400);
      throw new Error('No Open jobs');
    }
  })
);

module.exports = router;
