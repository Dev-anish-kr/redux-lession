import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectByPostId, updatePost } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/userSlice";

const EditPostForm = () => {

    const {postId} = useParams();
    const navigate = useNavigate();

    const post = useSelector((state) => selectByPostId(state, Number(postId)));


    const users = useSelector(selectAllUsers);

 

    const [title, setTitle] = useState(post?.title)
    const [content, setContent] = useState(post?.body)
    const [userId, setUserId] = useState(post?.userId)
    const [requestStatus, setRequestStatus] = useState("idle");

    const dispatch = useDispatch()
    if (!post) {
        return (
            <section>
                <p>Page not found</p>
            </section>
        )
    }

    const onTitleChange = e => setTitle(e.target.value);
    const contentChange = e => setContent(e.target.value);
    const onAutherChange = e => setUserId(e.target.value);

    const cansave = [content, title, userId].every(Boolean) && requestStatus === "idle";


    const onSubmit = () => {
        if (cansave) {
            try {
                setRequestStatus("pending");
                dispatch(updatePost({id:post.id,title,body:content, reactions:post.reactions})).unwrap();
                setTitle("");
                setContent("");
                setUserId("");
                navigate(`/post/${postId}`)
            } catch (error) {
                console.log("failed to save", error);
            }
            finally {
                setRequestStatus("idle")
            }
        }
    }

    const userOptions = users.map(user => (
        <option value={user.id} key={user.id}>
            {user.name}
        </option>
    ))


    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChange}
                />
                <label htmlFor="postAuther">Auther</label>
                <select onChange={onAutherChange} id="postAuther" name="postAuther" defaultValue={userId} type="text">
                    <option value=""></option>
                    {userOptions}
                </select>
                <label htmlFor="postContent">Post Content:</label>
                <textarea
                    name="postContent"
                    id="postContent"
                    value={content}
                    onChange={contentChange}
                ></textarea>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!cansave}
                >Save Post</button>
            </form>
        </section>
    )
}

export default EditPostForm