const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/friends', authController.friends);
router.post('/logout', authController.logout);
router.post('/users', authController.users);
router.post('/friendDB', authController.friendDB);


module.exports = router;