import { 
    createAsyncThunk, 
    createSelector, 
    createSlice,
    createEntityAdapter
} from "@reduxjs/toolkit";
import axios from "axios";

import sub from "date-fns/sub";
const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const postAdapter=createEntityAdapter({
    sortComparer: (a,b)=>b.date.localeCompare(a.date)
})

const initialState = postAdapter.getInitialState({
    status: "idle",
    error: null,
    count:0
})

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
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
        increaseCount(state,action){
            state.count=state.count+1;
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
                postAdapter.upsertMany(state,loadedPosts);
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
                postAdapter.addOne(state,action.payload);
            })
            .addCase(updatePost.fulfilled,(state,action)=>{
                if(!action.payload?.id){
                    console.log("Update no completed");
                    console.log(action.payload);
                    return;
                }
                action.payload.date=new Date().toISOString();
                postAdapter.upsertOne(state,action.payload);
            })
            .addCase(deletePost.fulfilled,(state,action)=>{
                if(!action.payload?.id){
                    console.log("Delete could not completed");
                    console.log(action.payload);
                    return;
                }
                const {id}=action.payload;
                postAdapter.removeOne(state,id)
            })

    }
})

export const {
selectAll: selectAllPosts,
selectById: selectByPostId,
selectIds:selectPostIds
}=postAdapter.getSelectors(state=>state.posts);

export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;


export const selectPostsByUser= createSelector(
    [selectAllPosts,(state,userId)=>userId],
    (posts,userId)=>posts.filter(post=>post.userId===userId)
)


export const {increaseCount, reactionAdded } = postsSlice.actions

export default postsSlice.reducer