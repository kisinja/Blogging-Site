import Post from "../models/Post.js";

const increaseVisit = async (req, res, next) => {

    const slug = req.params.slug;

    await Post.findOneAndUpdate({ slug }, { $inc: { visits: 1 } });

    next();
};

export default increaseVisit;