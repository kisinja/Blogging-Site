import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: "",
    },
    slug: {
        type: String,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "general",
    },
    content: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    visits: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    embeddings: {
        type: [Number],
        default: [],
    },
}, {
    timestamps: true
});

postSchema.pre("save", async function (next) {
    if (this.isModified('title')) {
        let baseSlug = slugify(this.title, { lower: true, strict: true });
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await this.model("Post").exists({ slug: uniqueSlug })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = uniqueSlug;
    }
    next();
});

export default mongoose.model('Post', postSchema);