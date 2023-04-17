import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from "react-redux";
import { fetchUser } from './features/users/userSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchPosts } from './features/posts/postsSlice';

store.dispatch(fetchUser());
store.dispatch(fetchPosts());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
