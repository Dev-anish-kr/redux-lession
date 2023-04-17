import PostExcept from './PostExcept';
import { useSelector} from 'react-redux'
import { selectAllPosts, getPostError, getPostStatus} from './postsSlice';



const PostList = () => {
    const posts = useSelector(selectAllPosts);
    const postsStatue = useSelector(getPostStatus);
    const error = useSelector(getPostError);

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