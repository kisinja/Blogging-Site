import express from 'express';
import { getPosts, getPostsBySlug, createPost, deletePost, uploadAuth, featurePost, sharePost, searchPosts } from '../controllers/post.js';
import increaseVisit from '../middlewares/increaseVisit.js';
import authUser from '../middlewares/authUser.js';
const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);

router.get("/:slug", increaseVisit, getPostsBySlug);

router.post("/", authUser, createPost);

router.delete("/:id", authUser, deletePost);

router.patch('/feature', authUser, featurePost);

router.patch('/share', sharePost);

router.post('/search', searchPosts);

export default router;