import { useAuth, useUser } from "@clerk/clerk-react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {

    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [value, setValue] = useState('');
    const nav = useNavigate();

    const [cover, setCover] = useState(null);
    const [img, setImg] = useState(null);
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        img && setValue(prev => prev + `<p><img src="${img}" alt=""/></p>`);
    }, [img]);

    useEffect(() => {
        video && setValue(prev => prev + `<p><iframe className="ql-video rounded-xl" src="${video}"/></p>`);
    }, [video]);

    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },
        onSuccess: (res) => {
            toast.success('Post has been created');
            nav(`/${res.data.slug}`);
        }
    });

    if (!isLoaded) {
        return <div className="">Loading...</div>;
    }

    if (isLoaded && !isSignedIn) {
        return <div className="">Please sign in</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            desc: formData.get('desc'),
            content: value,
            img: cover
        };

        mutation.mutate(data);
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-xl font-light">Create a new post</h1>

            <form className="flex flex-col gap-6 flex-1 mb-6 " onSubmit={handleSubmit}>

                <Upload setData={setCover} setProgress={setProgress} type="image">
                    <button className="p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white w-max">
                        Add a cover image
                    </button>
                </Upload>

                <span>
                    {cover && <p className="text-sm">{cover.filePath}</p>}
                </span>

                <input
                    type="text"
                    placeholder="My Awesome Story"
                    className="bg-transparent text-4xl font-semibold outline-none"
                    name="title"
                />
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-sm">Choose a category:</label>
                    <select name="category" className="p-2 rounded-xl bg-white shadow-md">
                        <option value="general">General</option>
                        <option value="webdesign">Web design</option>
                        <option value="development">Development</option>
                        <option value="databases">Databases</option>
                        <option value="seo">Search Engines</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <textarea
                    name="desc"
                    placeholder="A Short Description"
                    className="p-4 rounded-xl bg-white shadow-md"
                />
                <div className="flex flex-1">
                    <div className="flex flex-col items-center gap-2 mr-2">
                        <Upload setData={setImg} setProgress={setProgress} type="image">
                            📷
                        </Upload>
                        <Upload setData={setVideo} setProgress={setProgress} type="video">
                            🎥
                        </Upload>
                    </div>
                    <ReactQuill
                        theme="snow"
                        className="flex-1 rounded-xl bg-white shadow-md"
                        value={value}
                        onChange={setValue}
                        readOnly={0 < progress && progress < 100}
                    />
                </div >
                <button className="bg-blue-800 text-white font-medium rounded-xl mt-4 w-36 p-2 disabled:bg-blue-400 disabled:cursor-not-allowed" disabled={mutation.isPending || 0 < progress && progress < 100}>
                    {mutation.isPending ? 'Sending...' : 'Send'}
                </button>
                {
                    progress > 0 && progress < 100 && (
                        <p>
                            Uploading cover image: {progress}%
                        </p>
                    )
                }
                {mutation.isError && <span className="text-red-400">{mutation.error.message}</span>}
            </form >
        </div >
    );
};

export default Write;