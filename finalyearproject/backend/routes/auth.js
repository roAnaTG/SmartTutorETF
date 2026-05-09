const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, uploadAvatar } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile/avatar', auth, upload.single('avatar'), uploadAvatar);
router.put('/password', auth, changePassword);

module.exports = router;
