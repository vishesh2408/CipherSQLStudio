const UserProgress = require('../models/UserProgress');

const Assignment = require('../models/Assignment');

exports.saveProgress = async (req, res) => {
  const { assignmentId, sqlQuery, isCompleted } = req.body;
  console.log(`[saveProgress] Saving for user: ${req.user.id}, Assignment: ${assignmentId}`);
  console.log(`[saveProgress] Query: ${sqlQuery.substring(0, 50)}...`);

  try {
    let progress = await UserProgress.findOne({ userId: req.user.id, assignmentId });
    let wasAlreadyCompleted = false;

    if (progress) {
      console.log(`[saveProgress] Found existing progress. Updating.`);
      wasAlreadyCompleted = progress.isCompleted;
      progress.sqlQuery = sqlQuery;
      progress.lastAttempt = Date.now();
      progress.attemptCount += 1;
      if (isCompleted) progress.isCompleted = true; // Once completed, stays completed
    } else {
      console.log(`[saveProgress] Creating new progress record.`);
      progress = new UserProgress({
        userId: req.user.id,
        assignmentId,
        sqlQuery,
        isCompleted,
        attemptCount: 1
      });
    }

    const saved = await progress.save();
    console.log(`[saveProgress] Saved successfully: ${saved._id}`);

    // If newly completed, increment global solved count
    if (isCompleted && !wasAlreadyCompleted) {
       console.log(`[saveProgress] Incrementing global solved count.`);
       await Assignment.findByIdAndUpdate(assignmentId, { $inc: { 'stats.solved': 1 } });
    }

    res.json(progress);
  } catch (err) {
    console.error(`[saveProgress] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProgress = async (req, res) => {
    try {
        const query = { userId: req.user.id };
        if (req.query.assignmentId) {
            query.assignmentId = req.query.assignmentId;
        }
        console.log(`Fetching progress for user ${req.user.id} with query:`, query);
        const progress = await UserProgress.find(query);
        console.log(`Found ${progress.length} progress records.`);
        res.json(progress);
    } catch (err) {
        console.error("Error fetching progress:", err);
        res.status(500).json({ error: err.message });
    }
};
