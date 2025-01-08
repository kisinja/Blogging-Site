import express from 'express';

const router = express.Router();
import { getSavedPosts, savePost, getUserProfile, updateUserProfile } from '../controllers/user.js';
import authUser from '../middlewares/authUser.js';
import upload from '../multerConfig.js';

router.get('/saved', authUser, getSavedPosts);
router.patch('/posts/save', authUser, savePost);
router.get('/profile', authUser, getUserProfile);
router.put("/updateProfile", authUser, updateUserProfile);

export default router;