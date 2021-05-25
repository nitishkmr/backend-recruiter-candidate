const mongoose = require('mongoose');

const appliedJobSchema = mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    status: {
      /* Pending, Accepted, Rejected */
      type: String,
      required: true,
      default: 'Pending',
    },
    isActive: {
      /* for soft delete, if required */
      type: boolean,
      require: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AppliedJob', appliedJobSchema);
