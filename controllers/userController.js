const generateToken = require('../utils/generateToken');
const User = require('../models/userModel');
const AppliedJob = require('../models/appliedJobModel');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// @desc Auth user & get token
// @route POST /api/users/login/
// @access Public (no token req)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // considering that email and password will be received in the post req to this api.
  console.log(email + ' ' + password);
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isRecruiter: user.isRecruiter,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
});

// @desc Register User
// @route POST /api/users/
// @access Public (no token req)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isRecruiter } = req.body;
  // console.log(name + ' ' + email + ' ' + password + ' ' + isRecruiter);
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  /* hash password */
  const salt = await bcrypt.genSalt(10);
  const encryptedPass = await bcrypt.hash(password, salt);

  const user = User.create({
    name,
    email,
    password: encryptedPass,
    isRecruiter,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isRecruiter: user.isRecruiter,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User not registered');
  }
});

// @desc Get user dashboard
// @route POST /api/users/dashboard
// @access Private
const getDashboard = asyncHandler(async (req, res) => {
  // will receive user obj in req if user is authenticated
  const user = await User.findById(req.user._id);
  const isRecruiter = user.isRecruiter;

  if (isRecruiter) {
    /* search for candidates who have applied to current recruiter's jobs */
    const recruiterJobsList = await AppliedJob.find({ recruiterId: user._id });
    if (recruiterJobsList.length > 0) {
      console.log(recruiterJobsList);
    } else {
      res.status(404);
      throw new Error('No candidates found');
    }
  } else {
    // If a candidate is logged in
    const appliedList = await AppliedJob.find({ candidateId: user._id });
    if (appliedList.length > 0) {
      console.log(appliedList);
    } else {
      res.status(404);
      throw new Error('No applied jobs found');
    }
  }

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isRecruiter: user.isRecruiter,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
module.exports = { loginUser, registerUser, getDashboard };
