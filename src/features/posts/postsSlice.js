import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

import sub from "date-fns/sub";
const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    name: "posts",
    posts: [],
    status: "idle",
    error: null
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    try {
        const response = await axios.get(POST_URL);
        return [...response.data]
    } catch (error) {
        return error.message;
    }
})

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
    try {
        const response = await axios.post(POST_URL, initialPost);
        return response.data;
    } catch (error) {
        return error.message;
    }
})

export const updatePost=createAsyncThunk("posts/updatePost", async (initialPost)=>{
    const {id}=initialPost;
    try {
        const response= await axios.put(`${POST_URL}/${id}`,initialPost)
        return response.data;
    } catch (error) {
        // return error.message;
        return initialPost;
    }
})

export const deletePost=createAsyncThunk("posts/deletePost", async(initialPost)=>{
    const {id}=initialPost;
    try{
        const response = await axios.delete(`${POST_URL}/${id}`);
        if(response?.status===200) return initialPost;
        return `${response?.status}:${response.statusText}`;


    }catch(err){
        return err.message;
    }
})

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postAdded: {
            reducer: (state, action) => {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find(post => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded"
                // adding Date and Reaction
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                });
                state.posts = loadedPosts;
                return;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "faild";
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled,(state,action)=>{
                action.payload.userId=Number(action.payload.userId);
                action.payload.date=new Date().toISOString();
                action.payload.reactions={
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload);
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled,(state,action)=>{
                if(!action.payload?.id){
                    console.log("Update no completed");
                    console.log(action.payload);
                    return;
                }
                const {id}=action.payload;
                action.payload.date=new Date().toISOString();
                const posts=state.posts.filter(post=>post.id!==id);
                state.posts=[...posts,action.payload];
            })
            .addCase(deletePost.fulfilled,(state,action)=>{
                if(!action.payload?.id){
                    console.log("Delete could not completed");
                    console.log(action.payload);
                    return;
                }
                const {id}=action.payload;
                const posts=state.posts.filter(post=>post.id!==id);
                state.posts=posts;
            })

    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;

export const selectByPostId=(state,postId)=> state.posts.posts.find(post=>post.id===postId);


export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer