import { useEffect } from 'react';
import PostExcept from './PostExcept';
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, getPostError, getPostStatus, fetchPosts } from './postsSlice';



const PostList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const postsStatue = useSelector(getPostStatus);
    const error = useSelector(getPostError);

    useEffect(() => {
        if (postsStatue === "idle") {
            dispatch(fetchPosts())
        }
    }, [postsStatue, dispatch])

    let content;
    if (postsStatue === "loading") {
        content = <p>Loading...</p>
    }
    if (postsStatue === "succeeded") {
        const orderPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = orderPosts.map((post,index )=> (
            <PostExcept key={index} post={post} />
        ))
    }
    if (postsStatue === "failed") {
        content = <p>{error}</p>
    }
    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}

export default PostList