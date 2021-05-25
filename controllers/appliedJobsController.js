const Job = require('../models/jobModel');
const AppliedJob = require('../models/appliedJobModel');
const asyncHandler = require('express-async-handler');

// @desc Apply for a job
// @route POST /api/candidate/apply
// @access Private ( only candidates )
const apply = asyncHandler(async (req, res) => {
  // will receive user obj in 'req.user' if user is authenticated
  if (req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const { jobIds } = req.body; // considering that array of job ids to be applied to, will be received in this api

  const appliedJobs = [];

  for (const jobId of jobIds) {
    const job = await Job.findOne({ _id: jobId });
    const appliedJob = await AppliedJob.create({
      candidateId: req.user._id,
      recruiterId: job.recruiterId,
      jobId,
    });

    if (appliedJob) {
      appliedJobs.push({ message: `Successfully applied to Job Title - ${job.title}.` });
    } else {
      appliedJobs.push({ message: `Error in applying to Job Title - ${job.title}.` });
    }
  }

  if (appliedJobs.length > 0) {
    res.status(201).json({ appliedJobs });
  } else {
    res.status(400);
    throw new Error('Error in applying');
  }
});

// @desc Delete a job application
// @route DELETE /api/candidate/delete-application
// @access Private ( only candidates )
const deleteApplication = asyncHandler(async (req, res) => {
  // will receive user obj in 'req.user' if user is authenticated
  if (req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const { jobId } = req.body; // considering that job id from which to withdraw application will be received in this api

  const deletedEntry = await AppliedJob.deleteOne({ jobId, candidateId: req.user._id, status: 'Pending' });
  if (deletedEntry) {
    res.status(200).json({ message: 'Job application withdrawn' });
  } else {
    res.status(400);
    throw new Error('Error in deleting job application');
  }
});

module.exports = { apply, deleteApplication };
