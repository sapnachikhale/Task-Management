const { validationResult, body } = require('express-validator');
const Task = require('../models/Task');

/**
 * Validation rules for creating a task.
 */
const createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .trim()
];

/**
 * GET /api/tasks
 * Retrieve all tasks for the authenticated user.
 * Managers can see all tasks; developers see only their own.
 */
const getTasks = async (req, res) => {
  try {
    let filter = {};

    // Developers only see their own tasks; managers see all tasks
    if (req.user.role !== 'manager') {
      filter.createdBy = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks.' });
  }
};

/**
 * POST /api/tasks
 * Create a new task. The createdBy field is set to the authenticated user.
 */
const createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { title, description, priority, status, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      createdBy: req.user._id
    });

    await task.save();

    // Populate createdBy before returning
    await task.populate('createdBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

/**
 * PUT /api/tasks/:id
 * Update an existing task. Only the owner or a manager can update.
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Authorization: only the owner or a manager can update
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to update this task.' });
    }

    const { title, description, priority, status, dueDate } = req.body;

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    await task.populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task. Only the owner or a manager can delete.
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Authorization: only the owner or a manager can delete
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to delete this task.' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

/**
 * PATCH /api/tasks/:id/status
 * Update only the status field of a task.
 */
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Authorization: only the owner or a manager can update status
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to update this task.' });
    }

    task.status = status;
    await task.save();
    await task.populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update task status.' });
  }
};

module.exports = {
  getTasks,
  createTask,
  createTaskValidation,
  updateTask,
  deleteTask,
  updateStatus
};
