import { Webhook } from "svix";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const clerkWebHook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook secret needed!");
    }

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let event;

    try {
        event = wh.verify(payload, headers);
    } catch (error) {
        res.status(400).json({
            message: "Webhook verification failed",
            error: error.message,
        });
    }


    if (event.type === 'user.created') {
        console.log("User creation event received:", event.data);

        const newUser = new User({
            clerkUserId: event.data.id,
            username: event.data.username,
            email: event.data.email_addresses[0]?.email_address,
            img: event.data.profile_image_url,
        });

        try {
            await newUser.save();
            console.log("New user created successfully:", newUser);
        } catch (error) {
            console.error("Failed to save user to DB:", error.message);
        }
    }


    if (event.type === 'user.deleted') {
        const deletedUser = await User.findOneAndDelete({
            clerkUserId: event.data.id
        });

        await Post.deleteMany({ user: deletedUser._id });
        await Comment.deleteMany({ user: deletedUser._id });
    }

    res.status(200).json({ message: "Webhook received" });

};

export { clerkWebHook };