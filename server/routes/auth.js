import express from 'express';

const router = express.Router();

import { register, login, google } from '../controllers/auth.js';

router.post('/register', register);

router.post('/login', login);

router.post("/google", google);

export default router;