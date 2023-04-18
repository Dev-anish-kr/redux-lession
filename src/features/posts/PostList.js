import PostExcept from './PostExcept';
import { useSelector} from 'react-redux'
import { selectPostIds, getPostError, getPostStatus} from './postsSlice';



const PostList = () => {
    const orderPostsIds=useSelector(selectPostIds);
    const postsStatue = useSelector(getPostStatus);
    const error = useSelector(getPostError);

    let content;
    if (postsStatue === "loading") {
        content = <p>Loading...</p>
    }
    if (postsStatue === "succeeded") {
        content = orderPostsIds.map(postId => (
            <PostExcept key={postId} postId={postId} />
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