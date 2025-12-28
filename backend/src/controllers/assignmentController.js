const Assignment = require('../models/Assignment');
const sandboxService = require('../services/sandboxService');
const llmService = require('../services/llmService');

exports.getAssignments = async (req, res) => {
  try {
    console.log('Fetching assignments...');
    const assignments = await Assignment.find().select('-setupSql -expectedOutput');
    console.log('Assignments found:', assignments.length);
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.runQuery = async (req, res) => {
  const { assignmentId, sqlQuery } = req.body;
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    await Assignment.findByIdAndUpdate(assignmentId, { $inc: { 'stats.attempts': 1 } });

    const result = await sandboxService.executeSql(sqlQuery, assignment.setupSql);
    
    // Verify Result
    let passed = false;
    let feedback = "";
    
    if (result.success && assignment.expectedOutput && assignment.expectedOutput.value) {
      const expectedRows = assignment.expectedOutput.value;
      const actualRows = result.rows || [];

      if (actualRows.length !== expectedRows.length) {
        passed = false;
        feedback = `Expected ${expectedRows.length} rows, got ${actualRows.length}.`;
      } else {
        // Simple Set-Difference check or Row-by-Row check?
        // We now normalize by sorting the KEYS within each row JSON, AND sorting the rows themselves.
        // This allows Order-Independent comparison.
        
        const normalizeValue = (val) => {
             if (val === null || val === undefined) return "";
             return String(val); // Convert everything to string for loose comparison (Visual match)
        };

        const stringifyRow = (row) => {
            // Create a normalized object where all values are strings and keys are sorted
            const sortedKeys = Object.keys(row).sort();
            const normalizedRow = {};
            sortedKeys.forEach(key => {
                normalizedRow[key] = normalizeValue(row[key]);
            });
            return JSON.stringify(normalizedRow);
        };

        const expectedStrs = expectedRows.map(stringifyRow);
        const actualStrs = actualRows.map(stringifyRow);

        // Sort the rows string representations to allow any order of rows
        expectedStrs.sort();
        actualStrs.sort();
        
        passed = true;
        for (let i = 0; i < expectedRows.length; i++) {
            if (expectedStrs[i] !== actualStrs[i]) {
                passed = false;
                feedback = `Mismatch found at sorted position ${i+1}.\nExpected: ${expectedStrs[i]}\nGot: ${actualStrs[i]}`;
                break;
            }
        }
        
        if (passed) feedback = "All testcases passed!";
      }
    }
    
    res.json({ ...result, passed, feedback, expectedOutput: assignment.expectedOutput.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHint = async (req, res) => {
  const { assignmentId, sqlQuery, errorMessage } = req.body;
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const hint = await llmService.generateHint(
      assignment.question, 
      sqlQuery, 
      errorMessage, 
      assignment.sampleTables
    );

    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
