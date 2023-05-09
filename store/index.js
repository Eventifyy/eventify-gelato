import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    eAddress: "",
    sAddress: "",
    userInfo: "",
    smartAcc: "",
    eventItems: [],
    dashboardItems: []
  },
  reducers: {
    setEAddress: (state, action) => {
      state.eAddress = action.payload;
    },
    setSAddress: (state, action) => {
        state.sAddress = action.payload
    },
    setSmartAcc: (state, action) => {
      state.smartAcc = action.payload;
    },
    setUserInfo: (state, action) => {
        state.userInfo = action.payload
    },
    setEventItems: (state, action) => {
      state.eventItems = action.payload
    },
    setDashboardItems: (state, action) => {
      state.dashboardItems = action.payload
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
export const { setEAddress, setSAddress, setSmartAcc, setUserInfo, setEventItems, setDashboardItems } = loginSlice.actions;
