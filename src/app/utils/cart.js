// app/utils/cart.js
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

/**
 * Retrieves the cart from cookies.
 * Returns an array of cart items or an empty array if not found or malformed.
 */
export const getCart = () => {
  const cartCookie = Cookies.get('cart');
  if (!cartCookie) return [];

  try {
    return JSON.parse(cartCookie);
  } catch (error) {
    console.error('Failed to parse cart cookie:', error);
    toast.error('Failed to load cart. Clearing corrupted cart data.');
    Cookies.remove('cart'); // Clear the corrupted cookie
    return [];
  }
};

/**
 * Saves the cart to cookies.
 * @param {Array} cart - Array of cart items.
 */
export const setCart = (cart) => {
  try {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Expires in 7 days
  } catch (error) {
    console.error('Failed to set cart cookie:', error);
    toast.error('Failed to update cart.');
  }
};

/**
 * Adds a product to the cart.
 * @param {string} productId
 * @param {number} quantity
 */
export const addToCart = (productId, quantity) => {
  const cart = getCart();
  const existingProductIndex = cart.findIndex((item) => item.productId === productId);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  setCart(cart);
  toast.success('Product added to cart');
};

/**
 * Updates the quantity of a product in the cart.
 * @param {string} productId
 * @param {number} quantity
 */
export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const updatedCart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );
  setCart(updatedCart);
};

/**
 * Removes a product from the cart.
 * @param {string} productId
 */
export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.productId !== productId);
  setCart(updatedCart);
};
