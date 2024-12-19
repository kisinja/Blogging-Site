import { Link } from 'react-router-dom';
import Image from '../components/Image';
import PostMenuActions from '../components/PostMenuActions';
import Search from '../components/Search';
import Comments from '../components/Comments';

const SinglePost = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* details */}
            <div className="flex gap-8">
                <div className="lg:w-3/5 flex flex-col gap-8">
                    <h1 className='text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi eum aut.</h1>
                    <div className='flex gap-4 items-center text-gray-400 text-sm'>
                        <span>Written by</span>
                        <Link to="" className='text-blue-800'>John Doe</Link>
                        <span>on</span>
                        <Link className='text-blue-800'>Web Design</Link>
                        <span>2 days ago</span>
                    </div>
                    <p className='text-gray-500 font-medium'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur ipsam eos beatae dignissimos voluptatem ad? Cum perspiciatis corrupti similique at deleniti? Ipsum voluptates modi facilis qui iure deserunt laudantium blanditiis?</p>
                </div>
                <div className="hidden lg:block w-2/5">
                    <Image path="/postImg.jpeg" w="600" className="rounded-2xl" />
                </div>
            </div>
            {/* content */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* text */}
                <div className="lg:text-lg flex flex-col gap-6 text-justify pr-4">
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur expedita sequi aliquid ullam impedit error dolorum magnam officiis illum labore modi maiores sunt ducimus reiciendis tempora, nulla odio accusamus totam?Lorem ipsum dolor sit amet consectetur adipisicing elit. Id et ducimus quo voluptatem quae perferendis quisquam alias, illum iusto incidunt harum itaque possimus nemo obcaecati praesentium totam dolorem ipsam est?Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid nam illo beatae magni ut! Eaque, modi provident? Ullam aut dolores architecto expedita praesentium! Vitae, maiores laboriosam. Omnis unde officiis fugiat.
                    </p>
                </div>

                {/* menu */}
                <div className="px-4 h-max sticky top-8">
                    <h1 className='mb-4 text-sm font-medium'>Author</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-8">
                            <Image path="userImg.jpeg" className="w-12 h-12 rounded-full object-cover" w="48" h="48" />
                            <Link className='text-blue-800'>John Doe</Link>
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

                    <PostMenuActions />

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

            <Comments />
        </div>
    )
}

export default SinglePost