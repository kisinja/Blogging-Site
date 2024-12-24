import ImageKit from 'imagekit';
import Post from '../models/Post.js';
import User from '../models/User.js';

const getPosts = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const query = {};

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) {
        query.category = cat;
    }

    if (searchQuery) {
        query.title = { $regex: searchQuery, $options: 'i' };
    }

    if (author) {
        const user = await User.findOne({ username: author }).select('_id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        query.user = user._id;
    }

    if (featured) {
        query.isFeatured = true;
    }

    let sortObj = { createdAt: -1 };

    if (sortQuery) {
        switch (sortQuery) {
            case "newest":
                sortObj = { createdAt: -1 };
                break;
            case "oldest":
                sortObj = { createdAt: 1 };
                break;
            case "popular":
                sortObj = { visits: -1 };
                break;
            case "trending":
                sortObj = { shares: -1 };
                query.createdAt = {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                }
                break;
            default:
                break;
        }
    }

    const posts = await Post.find(query)
        .populate('user', 'username email img')
        .limit(limit)
        .sort(sortObj)
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

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role === "admin") {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Post deleted successfully" });
    }

    const user = await User.findOne({ clerkUserId });

    const post = await Post.findByIdAndDelete({ _id: req.params.id, user: user._id });
    if (!post) {
        return res.status(403).json({ message: 'You can only delete your post!' });
    }
    res.status(200).json({ message: "Post deleted successfully" });
};

const featurePost = async (req, res) => {

    const { postId } = req.body;

    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
        return res.status(403).json("You cannot feature posts!");
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found!' });
    }

    const isFeatured = post.isFeatured;

    const updatedPost = await Post.findByIdAndUpdate(postId, { isFeatured: !isFeatured }, { new: true });

    res.status(200).json({ updatedPost });
};

const sharePost = async (req, res) => {

    const { postId } = req.body;

    const post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { shares: 1 } },
        { new: true }
    );

    if (!post) {
        return res.status(404).json({ message: 'Post not found!' });
    }

    res.status(200).json({ shares: post.shares });
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
    uploadAuth,
    featurePost,
    sharePost,
};