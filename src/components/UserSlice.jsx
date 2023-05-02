
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    user:{
        username:"Rahul Kathuria",
        email:"rahul@gmail.com",
        walletAddress:"0xdsdsa3fhdsjfhsdueyf"
    }
}
const UserSlice=createSlice({
    initialState,
    name:"UserSlice",
    reducers:{
        setUser:(state,{payload})=>{
            console.log(payload)
            state.user=payload
        }
    }
})
export default UserSlice.reducer
export const {setUser}=UserSlice.actions