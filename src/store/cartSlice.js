// app/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to hold cart items
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);

      if (existingItem) {
        // Update the quantity if the item already exists
        existingItem.quantity += quantity;
      } else {
        // Add new item to the cart
        state.items.push({ productId, quantity });
      }
    },
    removeItem: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
