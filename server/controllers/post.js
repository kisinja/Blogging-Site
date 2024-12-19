import ImageKit from 'imagekit';
import Post from '../models/Post.js';
import User from '../models/User.js';

const getPosts = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const posts = await Post.find()
        .populate('user', 'username email img')
        .limit(limit)
        .skip(limit * (page - 1));

    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
};

const getPostsBySlug = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate('user', 'username img');

    res.status(200).json(post);
};

const createPost = async (req, res) => {

    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newPost = new Post({
        user: user._id,
        ...req.body
    });

    const post = await newPost.save();
    res.status(201).json(post);
};

const deletePost = async (req, res) => {

    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findOne({ clerkUserId });

    const post = await Post.findByIdAndDelete({ _id: req.params.id, user: user._id });
    if (!post) {
        return res.status(403).json({ message: 'You can only delete your post!' });
    }
    res.status(200).json({ message: "Post deleted successfully" });
};

const imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/kisinjakit",
    publicKey: "public_55qUsE/ezrLLUf90TsOw3bbMPpY=",
    //publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: "private_2B7Jmd02SKHKze2CPC+NSTF/TDI=",
});

const uploadAuth = async (req, res) => {

    let result = imagekit.getAuthenticationParameters();
    console.log(result);
    res.status(200).json(result);
};

export {
    getPosts,
    getPostsBySlug,
    createPost,
    deletePost,
    uploadAuth
};