import { useContext } from "react"
import Image from "./Image";
import { AppContext } from "../context/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Comment = ({ comment, postId }) => {

    const { formatTimeAgo } = useContext(AppContext);
    const user = useSelector(state => state.auth.user);
    const token = localStorage.getItem("token") || "";
    const role = user?.publicMetadata?.role;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            return axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comments/${comment._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success("Comment deleted!");
        },
        onError: (error) => {
            toast.error(error.response.data);
        }
    });

    return (
        <div className="p-4 bg-slate-50 rounded-xl mb-4 ">
            <div className="flex items-center gap-2">
                <Image src={comment.user.img} className="w-10 h-10 rounded-full object-cover" w="40" />
                <span className="font-medium">
                    {
                        user?.username === comment.user?.username ? (
                            `Me`
                        ) : (
                            comment.user?.username
                        )
                    }
                </span>
                <span className="text-sm text-gray-500">
                    {formatTimeAgo(comment.createdAt)}
                </span>

                {
                    user && (comment.user.username === user.username || role === "admin") && (
                        <span className="text-xs text-red-300 hover:text-red-500 cursor-pointer" onClick={() => mutation.mutate()}>
                            Delete
                            {mutation.isPending && <span className="text-xs">(in progress)</span>}
                        </span>
                    )
                }
            </div>

            <div className="mt-4">
                <p>{comment.desc}</p>
            </div>
        </div>
    )
}

export default Comment
