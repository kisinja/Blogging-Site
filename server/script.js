import mongoose from "mongoose";
import Post from './models/Post.js';

const initializeEmbeddingsField = async () => {
    try {
        await mongoose.connect("mongodb+srv://kisinjaelvis:25sep2002@cluster0.pu4w1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
            .then(() => console.log("Connected to MongoDB"));

        const result = await Post.updateMany(
            { embeddings: { $exists: false } },
            { $set: { embeddings: [] } }
        );

        console.log(`Updated ${result.nModified} posts with embeddings field.`);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error updating posts: ", error);
    }
};

//initializeEmbeddingsField();