import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    smartAcc: "",
    sAddress: "",
    userInfo: "",
  },
  reducers: {
    setSmartAcc: (state, action) => {
      state.smartAcc = action.payload;
    },
    setSAddress: (state, action) => {
        state.sAddress = action.payload
    },
    setUserInfo: (state, action) => {
        state.userInfo = action.payload
    }
  },
});

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

export default store;

// export the action
export const { setSmartAcc, setSAddress, setUserInfo } = loginSlice.actions;
