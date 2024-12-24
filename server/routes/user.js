import express from 'express';

const router = express.Router();
import { getSavedPosts, savePost } from '../controllers/user.js';

router.get('/saved', getSavedPosts);
router.patch('/posts/save', savePost);


export default router;