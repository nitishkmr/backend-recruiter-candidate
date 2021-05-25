const Job = require('../models/jobModel');
const AppliedJob = require('../models/appliedJobModel');
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

// @desc Post a job
// @route POST /api/recruiter/post-job
// @access Private ( only recruiters )
const postJob = asyncHandler(async (req, res) => {
  // will receive user obj in 'req.user' if user is authenticated
  if (!req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }
  const { title, description, numOfVacancies } = req.body; // considering that job details will be received in the post req to this api.

  const job = await Job.create({
    title,
    description,
    recruiterId: req.user._id,
    recruiterName: req.user.name,
    numOfVacancies,
  });

  if (job) {
    res.status(201).json({
      message: `Job Title - ${job.title} successfully posted.`,
    });
  } else {
    res.status(400);
    throw new Error('Job not posted');
  }
});

// @desc Accept or Reject a Candidate
// @route POST /api/recruiter/decision
// @access Private ( only recruiters )
const decision = asyncHandler(async (req, res) => {
  // will receive user obj in 'req.user' if user is authenticated
  if (!req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const { jobId, candidateId, candidateAccepted } = req.body; // considering that job and candidate details will be received in the post req to this api.

  const appliedJob = await AppliedJob.findOne({ jobId, candidateId }); // get the job <-> candidate relationship from AppliedJob collection
  const job = await Job.findOne({ jobId }); // get the job details from Job collection
  let numOfVacancies = job.numOfVacancies;
  let filledVacancies = job.filledVacancies;

  let updateAppliedJob;
  let updateJob;

  if (appliedJob) {
    if (candidateAccepted) {
      // update appliedJob collection
      updateAppliedJob = { status: 'Accepted' };

      // update job collection
      if (filledVacancies < numOfVacancies) {
        filledVacancies = filledVacancies + 1;
        updateJob = { filledVacancies };
      }
      if (filledVacancies === numOfVacancies) {
        // mark job as Close
        updateJob = { filledVacancies, isActive: false };
      }
    } else {
      updateAppliedJob = { status: 'Rejected' };
    }

    // make modifications in the AppliedJob collection
    const updatedAppliedJob = await AppliedJob.findOneAndUpdate({ jobId, candidateId }, updateAppliedJob, {
      new: true,
    });

    // make modifications in the Job collection
    const updatedJob = await Job.findOneAndUpdate({ jobId }, updateJob, { new: true });

    if (updatedAppliedJob && updatedJob) {
      res.status(201).json({
        message: 'Response submitted',
      });
    } else {
      res.status(400);
      throw new Error('Error is response submission');
    }
  }
});

module.exports = { postJob, getAllOpenJobs, decision };
