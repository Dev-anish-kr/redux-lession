import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AddpostForm from "./features/posts/AddpostForm";
import EditPostForm from "./features/posts/EditPostForm";
import PostList from "./features/posts/PostList";
import SinglePostPage from "./features/posts/SinglePostPage";
function App() {
  return (

    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<PostList />} />
        <Route path="/post">
          <Route index element={<AddpostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
