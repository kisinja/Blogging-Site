import { Link } from "react-router-dom"
import Image from "./Image"
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const PostCard = ({ post }) => {

    const { formatTimeAgo } = useContext(AppContext);

    return (
        <div className="flex flex-col xl:flex-row gap-8 mb-12">
            {/* image */}
            <div className="md:hidden xl:block xl:w-1/3">
                <Image
                    src={`${post.img}` || "https://i.pinimg.com/236x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"}
                    className="rounded-2xl object-cover"
                    w="735"
                    h="490"
                />
            </div>

            {/* details */}
            <div className="flex flex-col gap-4 xl:w-2/3">
                <Link to={`/${post.slug}`} className="text-4xl font-semibold">
                    {post.title}
                </Link>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>Written by</span>
                    <Link className="text-blue-800" to={`/posts?author=${post.user.username}`}>{post.user.username}</Link>
                    <span>on</span>
                    <Link className="text-blue-800" to={`/posts?cat=${post.category}`}>{post.category}</Link>
                    <span>
                        {formatTimeAgo(post.createdAt)}
                    </span>
                </div>
                <p>{post.desc}</p>
                <Link to={`/${post.slug}`} className="underline text-blue-800 text-sm">Read More</Link>
            </div>
        </div>
    );
};

export default PostCard;