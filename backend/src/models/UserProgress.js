const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  sqlQuery: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  attemptCount: { type: Number, default: 1 },
  lastAttempt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
