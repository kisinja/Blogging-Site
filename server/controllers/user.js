import imagekit from '../imageKitConfig.js';
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

const updateUserProfile = async (req, res) => {
    const userId = req.user;
    try {
        const updatedData = req.body;

        /* if (req.file) {
            const file = req.file;
            const result = await imagekit.upload({
                file: file.buffer,
                fileName: file.originalFileName,
                folder: '/elvisBlogProfileImages',
            });

            updatedData.img = result.url;
        } */

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile', details: error.message, success: false });
    }
};

export {
    getSavedPosts,
    savePost,
    getUserProfile,
    updateUserProfile
};