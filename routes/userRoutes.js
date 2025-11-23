const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authToken = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', authToken, UserController.getCurrentUser);

module.exports = router;