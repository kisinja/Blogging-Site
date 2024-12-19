import express from 'express';
import { getPosts, getPostsBySlug, createPost, deletePost, uploadAuth } from '../controllers/post.js';
const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);

router.get("/:slug", getPostsBySlug);

router.post("/", createPost);

router.delete("/:id", deletePost);

export default router;