import Comment from '../models/Comment.js';
import User from '../models/User.js';

const addComment = async (req, res) => {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newComment = new Comment({
        user: user._id,
        post: req.params.postId,
        desc: req.body.desc,
    });

    const comment = await newComment.save();

    setTimeout(() => {
        res.status(201).json(comment);
    }, 3000);
};


const deleteComment = async (req, res) => {
    const userId = req.user;
    const id = req.params.id;

    if (!userId) {
        return res.status(403).json({ message: 'Not Authorized' });
    };

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role === "admin") {
        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Comment deleted successfully" });
    }

    const user = await User.findById(userId);
    const deletedComment = await Comment.findOneAndDelete({ _id: id, user: user._id });
    if (!deletedComment) {
        return res.status(403).json({ message: 'Action unauthorized!' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
};


const getPostComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('user', 'username img')
        .sort({ createdAt: -1 });

    res.status(200).json(comments);
};

export { addComment, deleteComment, getPostComments };