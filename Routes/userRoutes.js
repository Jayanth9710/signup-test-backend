import express from 'express';
import { registerUser,loginUser,forgotPassword,passwordreset } from'../Controllers/User.js';
const router = express.Router();

router.post('/signup',registerUser);
router.post('/signin',loginUser);
router.post('/forgotPassword',forgotPassword);
router.post('/:userId/:token',passwordreset)

export default router;