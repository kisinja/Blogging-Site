import User from '../models/User.js';

const getSavedPosts = async (req, res) => {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }
    const user = await User.findOne({ clerkUserId: clerkUserId });

    res.status(200).json(user?.savedPosts);
};

const savePost = async (req, res) => {
    const { postId } = req.body;
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findOne({ clerkUserId: clerkUserId });

    const isSaved = user.savedPosts.some(p => p === postId);

    if (!isSaved) {
        await User.findByIdAndUpdate(user._id, {
            $push: { savedPosts: postId }
        });
    } else {
        await User.findByIdAndUpdate(user._id, {
            $pull: { savedPosts: postId }
        });
    }

    setTimeout(() => {
        res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
    }, 3000);
};

export {
    getSavedPosts,
    savePost
};