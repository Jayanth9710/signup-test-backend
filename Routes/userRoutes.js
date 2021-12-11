const express = require('express');
const { registerUser,loginUser } = require('../Controllers/User');
const router = express.Router();

router.post('/signup',registerUser);
router.post('/signin',loginUser);

module.exports = router;