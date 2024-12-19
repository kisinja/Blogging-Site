import { useState } from 'react';
import PostLists from '../components/PostLists';
import Sidemenu from '../components/Sidemenu';

const PostList = () => {

    const [open, setOpen] = useState(false);
    //const [posts, setPosts] = useState([]);

    return (
        <div className="">
            <h1 className="mb-8 text-2xl">Development Blog</h1>
            <button className='bg-blue-800 text-white rounded-2xl py-2 px-4 md:hidden mb-4' onClick={() => setOpen(!open)}>
                {
                    open ? 'Close' : 'Filter or Search'
                }
            </button>
            <div className="flex flex-col-reverse gap-8 md:flex-row">
                <div className="">
                    <PostLists />
                </div>
                <div className={`${open ? 'block' : 'hidden'} md:block`}>
                    <Sidemenu />
                </div>
            </div>
        </div>
    )
}

export default PostList
