import express from 'express';
import { clerkWebHook } from '../controllers/webhook.js';
import bodyParser from 'body-parser';

const router = express.Router();

router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHook);

export default router;