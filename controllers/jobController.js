const Job = require('../models/jobModel');
const asyncHandler = require('express-async-handler');

// @desc Post a job
// @route POST /api/jobs/
// @access Private ( only recruiters )
const postJob = asyncHandler(async (req, res) => {
  // will receive user obj in  'req.user' if user is authenticated
  const { title, description, numOfVacancies } = req.body; // considering that job details will be received in the post req to this api.

  const job = Job.create({
    title,
    description,
    recruiterId: req.user._id,
    recruiterName: req.user.name,
    numOfVacancies,
  });

  if (job) {
    res.status(201).json({
      message: `Job - ${job.title} successfully posted.`,
    });
  } else {
    res.status(400);
    throw new Error('Job not posted');
  }
});

// @desc Get all open jobs
// @route GET /api/jobs
// @access Public (no token req)
const getAllOpenJobs = asyncHandler(async (req, res) => {});

module.exports = { postJob, getAllOpenJobs };