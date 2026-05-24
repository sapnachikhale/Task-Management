const express = require('express');
const router = express.Router();
const { login, loginValidation } = require('../controllers/authController');

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token.
 */
router.post('/login', loginValidation, login);

module.exports = router;
