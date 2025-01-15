import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const { selectedColor, selectedSize } = item;

      const existingItem = state.cartItems.find(
        (cartItem) =>
          cartItem._id.$oid === item._id.$oid &&
          cartItem.selectedColor === selectedColor &&
          cartItem.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const item = action.payload;
      const { selectedColor, selectedSize } = item;

      state.cartItems = state.cartItems.filter(
        (cartItem) =>
          !(
            cartItem._id.$oid === item._id.$oid &&
            cartItem.selectedColor === selectedColor &&
            cartItem.selectedSize === selectedSize
          )
      );

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    incrementQuantityOfItem: (state, action) => {
      const item = action.payload;
      const { selectedColor, selectedSize } = item;

      const existingItem = state.cartItems.find(
        (cartItem) =>
          cartItem._id.$oid === item._id.$oid &&
          cartItem.selectedColor === selectedColor &&
          cartItem.selectedSize === selectedSize
      );

      if (existingItem) {
        const variant = item.variants.find((v) => v.color === selectedColor);
        const sizeObj = variant?.sizes.find((s) => s.size === selectedSize);
        const stock = sizeObj?.stock || 0;

        if (stock > existingItem.quantity) {
          existingItem.quantity += 1;
        }
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    decrementQuantityOfItem: (state, action) => {
      const item = action.payload;
      const { selectedColor, selectedSize } = item;

      const existingItem = state.cartItems.find(
        (cartItem) =>
          cartItem._id.$oid === item._id.$oid &&
          cartItem.selectedColor === selectedColor &&
          cartItem.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity -= 1;

        if (existingItem.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (cartItem) =>
              !(
                cartItem._id.$oid === item._id.$oid &&
                cartItem.selectedColor === selectedColor &&
                cartItem.selectedSize === selectedSize
              )
          );
        }
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    resetCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantityOfItem,
  decrementQuantityOfItem,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
