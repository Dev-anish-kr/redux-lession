import { useEffect } from 'react';
import PostExcept from './PostExcept';
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, getPostError, getPostStatus, fetchPosts } from './postsSlice';



const PostList = () => {
    const dispatch = useDispatch();
    const postsFetched = useSelector(selectAllPosts);
    const postsStatue = useSelector(getPostStatus);
    const error = useSelector(getPostError);

    const posts = postsFetched.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.id === value.id
        ))
    )
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
        content = orderPosts.map((post, index) => (
            <PostExcept key={post.id} post={post} />
        ))
    }
    if (postsStatue === "failed") {
        content = <p>{error}</p>
    }
    return (
        <section>
            {content}
        </section>
    )
}

export default PostList