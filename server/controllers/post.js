import ImageKit from 'imagekit';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { OpenAIEmbeddings } from '@langchain/openai';
import imagekit from '../imageKitConfig.js';

const uploadAuth = async (req, res) => {

    let result = imagekit.getAuthenticationParameters();
    console.log(result);
    res.status(200).json(result);
};

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
        .populate('user', 'username email img bio')
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

    const userId = req.user;
    console.log(userId);
    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findById(userId);
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

    const userId = req.user;
    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findByIdAndDelete({ _id: req.params.id, user: user._id });
    if (!post) {
        return res.status(403).json({ message: 'You can only delete your post!' });
    }

    if (user.role !== "admin" || post.user !== user._id) {
        return res.status(403).json({ message: 'You cannot delete this post!' });
    }

    res.status(200).json({ message: "Post deleted successfully" });
};

const featurePost = async (req, res) => {

    const { postId } = req.body;

    const userId = req.user;
    if (!userId) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== "admin") {
        return res.status(403).json({ message: 'You are not authorized to feature a post!' });
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

const searchPosts = async (req, res) => {

    const { query } = req.body;

    try {
        const embeddingModel = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const queryEmbedding = await embeddingModel.embedQuery(query);

        const posts = await Post.aggregate([
            {
                '$vectorSearch': {
                    index: 'posts_embeddings',
                    path: 'embeddings',
                    queryVector: queryEmbedding,
                    numCandidates: 150,
                    limit: 5,
                }
            }, {
                '$project': {
                    title: 1,
                    slug: 1,
                    score: {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]);

        res.status(200).json({ posts, success: true });

    } catch (error) {
        console.log("Error searching for posts:", error);
        res.status(500).json({ message: error.message, success: false });
    }
};

// Like a post
const likePost = async (req, res) => {
    const userId = req.user;
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ likes: post.likes, success: true });
    } catch (error) {
        console.log("Error searching for posts:", error);
        res.status(500).json({ message: error.message, success: false });
    }
};

export {
    getPosts,
    getPostsBySlug,
    createPost,
    deletePost,
    uploadAuth,
    featurePost,
    sharePost,
    searchPosts,
    likePost
};