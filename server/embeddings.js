import Post from "./models/Post.js";
import { OpenAIEmbeddings } from '@langchain/openai';

const generateAndSaveEmbeddings = async () => {
    try {
        const posts = await Post.find({ embeddings: { $size: 0 } });
        if (posts.length === 0) {
            console.log("No posts to generate embeddings for.");
            return;
        }

        const embeddingModel = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        for (const post of posts) {
            const embeddings = await embeddingModel.embedQuery(
                `${post.title} ${post.content}`
            );
            post.embeddings = embeddings;
            await post.save();
            console.log(`Embeddings generated for post: ${post.title}`);
        };

        console.log("Embeddings generation complete.");

    } catch (error) {
        console.log("Error generating embeddings:", error);
    }
};

export default generateAndSaveEmbeddings;