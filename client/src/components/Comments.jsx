import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "./Comment";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { IoSendSharp } from "react-icons/io5";

const fetchComments = async (postId) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comments/${postId}`);
    console.log(res);

    return res.data;
};

const Comments = ({ postId }) => {

    const { isPending, error, data } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchComments(postId),
    });

    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    const user = useUser();

    const mutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_BACKEND_URL}/comments/${postId}`, newComment, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            // clear the form
            document.querySelector('textarea').value = '';
        },
        onError: (error) => {
            toast.error(error.response.data);
        }
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Something went wrong....{error.message}</div>;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            desc: formData.get('desc'),
        };

        mutation.mutate(data);
    };

    return (
        <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
            <h1 className="text-xl text-gray-400 underline flex gap-2 items-center">Comments
                <span className="">
                    ({data.length})
                </span>
            </h1>

            <form className="flex items-center justify-between gap-8 w-full" onSubmit={handleSubmit}>
                <textarea
                    placeholder={user.user === null ? "Please Login to write a comment ❗❗" : "Write a comment..."}
                    className="w-full h-[150px] p-4 rounded-xl"
                    name="desc"
                    readOnly={user.user === null}
                />
                <button
                    className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:bg-blue-300"
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {/* {mutation.isPending ? 'Sending...' : 'Send'} */}
                    <IoSendSharp className="text-xl" />
                </button>
            </form>

            {
                isPending ? (
                    "Loading..."
                ) : error ? (
                    "Error loading comments"
                ) : (
                    <>
                        {
                            mutation.isPending && (
                                <Comment
                                    comment={{
                                        desc: `${mutation.variables.desc} (Sending...)`,
                                        createdAt: new Date().toISOString(),
                                        user: {
                                            img: user.img,
                                            username: user.username
                                        },
                                    }}
                                />
                            )
                        }
                    </>
                )
            }

            {
                data.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                ))
            }
        </div>
    )
}

export default Comments
