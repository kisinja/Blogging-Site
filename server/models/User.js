import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg",
    },
    bio: {
        type: String,
        default: "Default bio",
        max: 50,
    },
    savedPosts: {
        type: [String],
        default: [],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);