const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authController = require('../controllers/authController');
const progressController = require('../controllers/progressController');
const auth = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getMe);

// Assignment Routes
router.get('/assignments', assignmentController.getAssignments);
router.get('/assignments/:id', assignmentController.getAssignmentById);
router.post('/execute', assignmentController.runQuery);
router.post('/hint', assignmentController.getHint);

// Progress Routes (Protected)
router.post('/progress', auth, progressController.saveProgress);
router.get('/progress', auth, progressController.getProgress);

module.exports = router;
