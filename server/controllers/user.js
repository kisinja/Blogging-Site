import User from '../models/User.js';

const getSavedPosts = async (req, res) => {
    const userId = req.user;
    console.log(userId);
    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }
    const user = await User.findById(userId);

    res.status(200).json(user?.savedPosts);
};

const savePost = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user;
    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findById(userId);

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

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId).select("-password");

        res.json({
            success: true,
            user,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export {
    getSavedPosts,
    savePost,
    getUserProfile,
};