import { Link, useParams } from 'react-router-dom';
import Image from '../components/Image';
import PostMenuActions from '../components/PostMenuActions';
import Search from '../components/Search';
import Comments from '../components/Comments';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const fetchPost = async (slug) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/${slug}`);
    console.log(res);

    return res.data;
};

const SinglePost = () => {

    const { slug } = useParams();

    const { formatTimeAgo } = useContext(AppContext);

    const { isPending, error, data } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Something went wrong....{error.message}</div>;
    if (!data) return <div>Post not found</div>;

    return (
        <div className="flex flex-col gap-8">
            {/* details */}
            <div className="flex gap-8">
                <div className="lg:w-3/5 flex flex-col gap-8">
                    <h1 className='text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>{data.title}</h1>
                    <div className='flex gap-4 items-center text-gray-400 text-sm'>
                        <span>Written by</span>
                        <Link to="" className='text-blue-800'>{data.user.username}</Link>
                        <span>on</span>
                        <Link className='text-blue-800'>{data.category}</Link>
                        <span>
                            {
                                formatTimeAgo(data.createdAt)
                            }
                        </span>
                    </div>
                    <p className='text-gray-500 font-medium'>{data.desc}</p>
                </div>
                {data.img && (
                    <div className="hidden lg:block w-2/5">
                        <Image src={data.img} w="600" h="400" className="rounded-2xl" />
                    </div>
                )}
            </div>
            {/* content */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* text */}
                <div className="lg:text-lg flex flex-col gap-6 text-justify pr-4" dangerouslySetInnerHTML={{ __html: data.content }}>
                </div>

                {/* menu */}
                <div className="px-4 h-max sticky top-8 right-0">
                    <h1 className='mb-4 text-sm font-medium'>Author</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-8">
                            {data.user.img && <Image src={data.user.img} className="w-12 h-12 rounded-full object-cover" w="48" h="48" />}
                            <Link className='text-blue-800'>{data.user.username}</Link>
                        </div>
                        <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet, consectetur</p>
                        <div className="flex gap-2">
                            <Link>
                                <Image path="facebook.svg" />
                            </Link>
                            <Link>
                                <Image path="instagram.svg" />
                            </Link>
                        </div>
                    </div>

                    <PostMenuActions post={data} />

                    <h1 className='mt-8 mb-4 text-sm font-medium'>Categories</h1>
                    <div className='flex flex-col gap-2 text-sm'>
                        <Link to="/" className='underline'>All</Link>
                        <Link to="/" className='underline'>Web Design</Link>
                        <Link to="/" className='underline'>Development</Link>
                        <Link to="/" className='underline'>Databases</Link>
                        <Link to="/" className='underline'>Search Engines</Link>
                        <Link to="/" className='underline'>Marketing</Link>
                    </div>
                    <h1 className='mt-8 mb-4 text-sm font-medium'>Search</h1>
                    <Search />
                </div>
            </div>

            <Comments postId={data._id} />
        </div>
    )
}

export default SinglePost