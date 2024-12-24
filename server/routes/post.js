import express from 'express';
import { getPosts, getPostsBySlug, createPost, deletePost, uploadAuth, featurePost, sharePost } from '../controllers/post.js';
import increaseVisit from '../middlewares/increaseVisit.js';
const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);

router.get("/:slug", increaseVisit, getPostsBySlug);

router.post("/", createPost);

router.delete("/:id", deletePost);

router.patch('/feature', featurePost);

router.patch('/share', sharePost);

export default router;