const User = require('../models/userModel');
const AppliedJob = require('../models/appliedJobModel');
const Job = require('../models/jobModel');
const asyncHandler = require('express-async-handler');

// @desc Get user dashboard
// @route POST /api/users/dashboard
// @access Private
const getDashboard = asyncHandler(async (req, res) => {
  // will receive user obj in req if user is authenticated
  if (!req.user.isRecruiter) {
    res.status(401);
    throw new Error('Unauthorized');
  }
  const user = await User.findById(req.user._id);
  /* search for candidates who have applied to current recruiter's jobs */
  const recruiterJobsList = await AppliedJob.find({ recruiterId: user._id });
  const appliedCandidatesList = [];
  if (recruiterJobsList.length > 0) {
    recruiterJobsList.map(job => {
      appliedCandidatesList.push(job.candidateId);
    });
    res.json({ appliedCandidatesList });
  } else {
    res.status(404);
    throw new Error('No candidates found');
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
const makeDecision = asyncHandler(async (req, res) => {
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

module.exports = { getDashboard, postJob, makeDecision };
