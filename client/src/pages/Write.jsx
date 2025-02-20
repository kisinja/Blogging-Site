import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import { FcPicture } from "react-icons/fc";
import { FcFilmReel } from "react-icons/fc";
import NewFeaturePopup from '../components/NewFeaturePopup';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import Image from '../components/Image';
import { FiX } from 'react-icons/fi';

const Write = () => {

    const token = localStorage.getItem("token") || "";
    const [value, setValue] = useState('');
    const nav = useNavigate();

    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [cover, setCover] = useState(null);
    const [img, setImg] = useState(null);
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        img && setValue(prev => prev + `<p><img src="${img}" alt="" className="" width="300" height="300" /></p>`);
    }, [img]);

    useEffect(() => {
        video && setValue(prev => prev + `<p><iframe className="ql-video" src="${video}"/></p>`);
    }, [video]);

    const mutation = useMutation({
        mutationFn: async (newPost) => {
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


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            desc: formData.get('desc'),
            content: value,
            img: cover || "",

        };

        mutation.mutate(data);
    };

    const handleGenerateContent = async () => {
        if (!topic) {
            return toast.error('Please enter a topic');
        };

        setIsGenerating(true);

        try {
            const llm = new ChatOpenAI({ openAIApiKey: import.meta.env.VITE_OPEN_AI_API_KEY });
            const topicTemplate = 'Write a detailed blog post about {topic}, with a title too. Include an introduction, main content with subheadings, and a conclusion. Use bold headings, bullet points, and images to make the content engaging as react quill is being used to write the content. The content should be at least 500 words long. Use the latest findings from the internet';
            const topicTemplatePrompt = PromptTemplate.fromTemplate(topicTemplate);
            const topicTemplateChain = topicTemplatePrompt.pipe(llm);
            const response = await topicTemplateChain.invoke({
                topic: topic,
            });

            setValue(response.content);
        } catch (error) {
            toast.error('Failed to generate content');
            console.log(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRemoveCover = () => {
        setCover(null);
        setProgress(0);
    };

    return (
        <>
            <NewFeaturePopup />
            <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
                <h1 className="text-xl font-light">Create a new post</h1>

                <form className="flex flex-col gap-6 flex-1 mb-6 " onSubmit={handleSubmit}>

                    {cover ? (
                        <div className='flex gap-2 bg-white p-2 rounded-lg w-[70%] md:w-[300px] items-center border-dashed border-2 border-gray-600 relative'>
                            <div>
                                <Image src={cover} className=" w-14 h-14  md:w-20 md:h-20 rounded-full object-cover" />
                            </div>
                            <div className='text-xs text-gray-500 flex flex-col gap-2'>
                                <p className='font-semibold'>Selected Image:</p>
                                <p className="underline">{cover.split("/")[4]}</p>
                                <FiX
                                    className="text-2xl cursor-pointer text-red-600 hover:underline ml-2 absolute top-0 right-0"
                                    onClick={handleRemoveCover}
                                    title='remove'
                                />
                            </div>
                        </div>
                    ) : (
                        <Upload setData={setCover} setProgress={setProgress} type="image">
                            <button className="p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white w-fit active:scale-95" type='button'>
                                Add a cover image
                            </button>
                        </Upload>
                    )}

                    {progress > 0 && progress < 100 && (
                        <div className="relative w-[200px] md:w-1/2 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-orange-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 font-semibold">
                                Uploading: {progress}%
                            </span>
                        </div>
                    )}

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
                            <option value="automotive">Automotive</option>
                            <option value="football">Football</option>
                            <option value="mma">MMA</option>
                        </select>
                    </div>
                    <textarea
                        name="desc"
                        placeholder="A Short Description"
                        className="p-4 rounded-xl bg-white shadow-md"
                    />

                    <div className="flex items-center gap-4 relative bg-white rounded-full w-full md:w-[500px]">
                        <input
                            type="text"
                            placeholder="Enter a topic for content generation..."
                            className="bg-transparent text-sm outline-none p-2 rounded-full flex-1 placeholder:text-sm placeholder:italic text-gray-800"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleGenerateContent}
                            className="bg-green-600 text-white font-medium rounded-full py-2 px-4 w-fit"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Content'}
                        </button>
                    </div>

                    <div className="flex flex-1 relative">
                        <div className="flex items-center gap-2 mr-2 absolute top-1 right-0 bg-red-100 p-1 rounded shadow-sm">
                            <Upload setData={setImg} setProgress={setProgress} type="image">
                                <FcPicture
                                    className="text-2xl hover:bg-white rounded-full p-[2px] transition-all duration-200"
                                    title="Add picture"
                                />
                            </Upload>
                            <Upload setData={setVideo} setProgress={setProgress} type="video">
                                <FcFilmReel
                                    className="text-2xl hover:bg-white rounded-full p-[2px] transition-all duration-200"
                                    title="Add video"
                                />
                            </Upload>
                        </div>
                        <ReactQuill
                            theme="snow"
                            className="flex-1 h-fit rounded-xl bg-white shadow-md"
                            value={value}
                            onChange={setValue}
                            readOnly={0 < progress && progress < 100}
                        />
                    </div >
                    <button className="bg-blue-800 text-white font-medium rounded-xl mt-4 w-36 p-2 disabled:bg-blue-400 disabled:cursor-not-allowed mb-6" disabled={mutation.isPending || 0 < progress && progress < 100}>
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
        </>
    );
};

export default Write;