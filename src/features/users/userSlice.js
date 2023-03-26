import { createSlice } from "@reduxjs/toolkit";

const initialState=[
    {id:"0",name:"Jane"},
    {id:"1",name:"Sana"},
    {id:"2",name:"Ajay"},
    {id:"3",name:"Akash"}
]

const userSlice=createSlice({
    name:"users",
    initialState,
    reducers:{

    }
})

export const selectAllUsers=(state)=>state.users;

export default userSlice.reducer;