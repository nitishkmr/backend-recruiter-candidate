const User = require('../models/userModel');
const AppliedJob = require('../models/appliedJobModel');
const asyncHandler = require('express-async-handler');

// @desc Get user dashboard
// @route POST /api/users/dashboard
// @access Private
const getDashboard = asyncHandler(async (req, res) => {
  // will receive user obj in req if user is authenticated
  if (req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }
  const user = await User.findById(req.user._id);

  // If a candidate is logged in
  const appliedList = await AppliedJob.find({ candidateId: user._id });
  const appliedJobsList = [];
  if (appliedList.length > 0) {
    appliedList.map(appliedJob => {
      appliedJobsList.push({
        jobId: appliedJob.jobId,
        status: appliedJob.status,
      });
    });
    res.json(appliedJobsList);
  } else {
    res.status(404);
    throw new Error('No applied jobs found');
  }
});

module.exports = { getDashboard };
