import express from 'express';

const router = express.Router();
import { getSavedPosts, savePost, getUserProfile } from '../controllers/user.js';
import authUser from '../middlewares/authUser.js';

router.get('/saved', authUser, getSavedPosts);
router.patch('/posts/save', authUser, savePost);
router.get('/profile', authUser, getUserProfile);

export default router;