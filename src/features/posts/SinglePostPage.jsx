import { selectByPostId } from "./postsSlice";
import { useSelector } from "react-redux";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { Link, useParams } from "react-router-dom";

const SinglePostPage = () => {
    const {postId}=useParams();
    const post=useSelector((state)=>selectByPostId(state,Number(postId)));
    if(!post){
        return (
            <section>
                <p>Post not found</p>
            </section>
        );
    }
  return (
    <article>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className="postCredit">
            <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
  )
}

export default SinglePostPage