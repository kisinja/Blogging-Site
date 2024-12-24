import { useState, useEffect } from 'react';
import PostLists from '../components/PostLists';
import Sidemenu from '../components/Sidemenu';
import { useSearchParams } from 'react-router-dom';

// Utility function to capitalize each word
const capitalizeTitle = (title) => {
    return title
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const PostList = () => {
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();

    // Get the current category from search parameters
    const cat = searchParams.get("cat") || "All";

    // Capitalized category title
    const capitalizedCat = capitalizeTitle(cat);

    // Update the document title dynamically
    useEffect(() => {
        document.title = `${capitalizedCat} Blog | Your Website Name`;
    }, [capitalizedCat]);

    return (
        <div className="">
            <h1 className="mb-8 text-2xl">{capitalizedCat} Blogs</h1>
            <button
                className="bg-blue-800 text-white rounded-2xl py-2 px-4 md:hidden mb-4"
                onClick={() => setOpen(!open)}
            >
                {open ? 'Close' : 'Filter or Search'}
            </button>
            <div className="flex flex-col-reverse gap-8 md:flex-row">
                <div className="md:flex-1">
                    <PostLists />
                </div>
                <div className={`${open ? 'block' : 'hidden'} md:block`}>
                    <Sidemenu />
                </div>
            </div>
        </div>
    );
};

export default PostList;