const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recruiterName: {
      type: String,
      required: true,
    },
    numOfVacancies: {
      type: Number,
      required: true,
    },
    filledVacancies: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      // status: Open (true), Close (false)
      type: Boolean,
      require: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
