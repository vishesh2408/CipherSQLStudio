const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  topic: { 
      type: String, 
      enum: ['Basic SQL', 'Joins', 'Aggregation', 'Subqueries', 'Advanced'], 
      default: 'Basic SQL' 
  },
  question: { type: String, required: true },
  sampleTables: [
    {
      tableName: String,
      columns: [
        {
          columnName: String,
          dataType: String 
        }
      ],
      // We store a stringified JSON representation or small array for sample rows
      rows: [mongoose.Schema.Types.Mixed] 
    }
  ],
  expectedOutput: {
    type: { type: String, enum: ['table', 'value', 'count'] },
    value: mongoose.Schema.Types.Mixed
  },
  setupSql: { type: String, required: true }, // SQL to create/populate tables for this assignment
  stats: {
    attempts: { type: Number, default: 0 },
    solved: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
