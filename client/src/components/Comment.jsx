import { useContext } from "react"
import Image from "./Image";
import { AppContext } from "../context/AppContext";

const Comment = ({ comment }) => {

    const { formatTimeAgo } = useContext(AppContext);

    return (
        <div className="p-4 bg-slate-50 rounded-xl mb-4 ">
            <div className="flex items-center gap-2">
                <Image src={comment.user.img} className="w-10 h-10 rounded-full object-cover" w="40" />
                <span className="font-medium">{comment.user.username}</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">.</span>
                    <span className="text-sm text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <p>{comment.desc}</p>
            </div>
        </div>
    )
}

export default Comment
