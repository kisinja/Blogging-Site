import express from 'express';
import { getPosts, getPostsBySlug, createPost, deletePost, uploadAuth, featurePost } from '../controllers/post.js';
const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);

router.get("/:slug", getPostsBySlug);

router.post("/", createPost);

router.delete("/:id", deletePost);

router.patch('/feature', featurePost);

export default router;