const Job = require('../models/jobModel');
const asyncHandler = require('express-async-handler');

// @desc Get all open jobs
// @route GET /api/jobs
// @access Public (no token req)
const getAllOpenJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isActive: true });
  if (jobs.length > 0) {
    res.json({ jobs });
  } else {
    res.status(400);
    throw new Error('No Open jobs');
  }
});

module.exports = { getAllOpenJobs };
