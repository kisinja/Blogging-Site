import express from 'express';

const router = express.Router();

import { addComment, deleteComment, getPostComments } from '../controllers/comment.js';
import authUser from '../middlewares/authUser.js';

router.get('/:postId', getPostComments);
router.post('/:postId', authUser, addComment);
router.delete('/:id', authUser, deleteComment);

export default router;