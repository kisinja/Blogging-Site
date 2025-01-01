import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const highLightText = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    return text.split(regex).map((part, index) => part.toLowerCase() === query.toLowerCase() ? (
        <span className="text-blue-800 text-xs underline font-semibold" key={index}>{part}</span>
    ) : part);
};

const HomeSearch = () => {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const { setOpenMenu } = useContext(AppContext);

    const handleSearch = async (query) => {
        setLoading(true);
        if (query.trim() === '') {
            setLoading(false);
            setPosts([]);
            setErr('');
            return;
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts/search`, { query });
            if (data.success) {
                setPosts(data.posts);
                setErr(data.posts.length === 0 ? "Post not found" : '');
            } else {
                setErr("Error searching posts");
            }
        } catch (error) {
            console.log("Error searching posts: ", error);
            setErr("Error searching posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(query);
    }, [query]);

    return (
        <div className="relative">
            <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="gray"
                    className={query.trim() !== "" ? "cursor-pointer hover:stroke-current" : ""}
                    title="Search"
                >
                    <circle cx="10.5" cy="10.5" r="7.5" />
                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent focus:outline-none text-base text-gray-700 placeholder:italic"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {loading && <p className="text-sm text-gray-500 mt-1 p-2">Searching...</p>}
            {err && <p className="text-sm text-red-500 mt-1 p-2">{err}</p>}

            {
                posts.length > 0 && query.trim() !== "" && (
                    <div className="mt-4 absolute bg-white w-fit p-4 rounded-lg shadow-lg">
                        <h2 className="font-semibold text-md text-blue-800">Search Results:</h2>
                        <ul>
                            {posts.map((post, index) => (
                                <li key={index} className="border-b py-2 hover:bg-gray-100 hover:rounded-lg px-2 flex gap-2 items-center">
                                    <span className="text-gray-500 text-xs">
                                        {index + 1}.
                                    </span>
                                    <Link to={`${post.slug}`} onClick={
                                        () => {
                                            setQuery('');
                                            setOpenMenu(false);
                                        }
                                    }>
                                        <h3 className="font-medium text-xs"
                                        >
                                            {
                                                highLightText(post.title.slice(0, 50), query)
                                            }...
                                        </h3>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }

            {posts.length === 0 && query.trim() !== '' && !loading && (
                <div className="mt-4 text-gray-500">
                    <p>Post not found</p>
                </div>
            )}
        </div>
    );
};

export default HomeSearch;