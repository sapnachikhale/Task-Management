const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  createTaskValidation,
  updateTask,
  deleteTask,
  updateStatus
} = require('../controllers/taskController');

// All task routes are protected by the auth middleware
router.use(auth);

/**
 * GET /api/tasks
 * Get all tasks for the authenticated user.
 */
router.get('/', getTasks);

/**
 * POST /api/tasks
 * Create a new task.
 */
router.post('/', createTaskValidation, createTask);

/**
 * PUT /api/tasks/:id
 * Update an existing task.
 */
router.put('/:id', updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete a task.
 */
router.delete('/:id', deleteTask);

/**
 * PATCH /api/tasks/:id/status
 * Update just the status of a task.
 */
router.patch('/:id/status', updateStatus);

module.exports = router;
