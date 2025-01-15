import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: localStorage.getItem("address")
    ? JSON.parse(localStorage.getItem("address"))
    : [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      const address = action.payload;
      state.address = [...state.address, address];

      localStorage.setItem("address", JSON.stringify(state.address));
    },
  },
});

export const { saveAddress } = addressSlice.actions;

export default addressSlice.reducer;
