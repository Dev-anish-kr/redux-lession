import { useSelector } from 'react-redux'
import PostAuthor from './PostAuthor';
import { selectAllPosts } from './postsSlice';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
const PostList = () => {
    const posts = useSelector(selectAllPosts);
    const orderPosts=posts.slice().sort((a,b)=>b.date.localeCompare(a.date));
    const RenderedPosts = orderPosts.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <p className="postCredit">
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post}/>
        </article>
    ))
    return (
        <section>
            <h2>Posts</h2>
            {RenderedPosts}
        </section>
    )
}

export default PostList