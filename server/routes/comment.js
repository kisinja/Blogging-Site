import express from 'express';

const router = express.Router();

import { addComment, deleteComment, getPostComments } from '../controllers/comment.js';

router.get('/:postId', getPostComments);
router.post('/:postId', addComment);
router.delete('/:id', deleteComment);

export default router;