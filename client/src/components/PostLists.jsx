import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const PostLists = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchPosts = async (pageParam) => {
        const res = await axios.get(`${backendUrl}/posts`, {
            params: {
                page: pageParam
            }
        });
        return res.data;
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined
    });


    if (status === "loading") return <p>Loading...</p>

    if (status === "error") return <p className="text-red-400 text-lg">Something went wrong!</p>

    const allPosts = data?.pages?.flatMap(page => page.posts) || [];


    return (
        <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Loading more posts...</h4>}
            endMessage={
                <p className="">
                    All posts loaded.
                </p>
            }
        >
            {
                allPosts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))
            }
        </InfiniteScroll>
    );
};

export default PostLists;