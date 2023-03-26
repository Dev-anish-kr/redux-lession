import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";
import { postAdded } from "./postsSlice";
const AddpostForm = () => {
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useSelector(selectAllUsers);
  console.log(selectAllUsers);

  const dispatch = useDispatch()

  const onTitleChange = e => setTitle(e.target.value);
  const contentChange = e => setContent(e.target.value);
  const onAutherChange = e => setUserId(e.target.value);

  const onSubmit = () => {
    if (title && content) {
      dispatch(
        postAdded(title, content, userId)
      )
      setContent("");
      setTitle("");
    }
  }
 const cansave=Boolean(title)&&Boolean(content)&&Boolean(userId);

  const userOptions = users.map(user => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ))


  return (
    <section>
      <h2>Add a New Post</h2>
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
        <select onChange={onAutherChange} id="postAuther" name="postAuther" type="text">
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

export default AddpostForm