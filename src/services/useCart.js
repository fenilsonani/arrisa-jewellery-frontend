// hooks/useCart.js

import { useState, useEffect } from 'react';
import apiService from './apiService'; // Update the path accordingly
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode'; // Optional, if token is a JWT

const CART_COOKIE_NAME = 'cart_id';
const TOKEN_COOKIE_NAME = 'token';

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to check if user is authenticated and return userId
  const getUserId = () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded?.userId; // Adjust based on your token structure
      } catch (err) {
        console.error('Invalid token:', err);
        return null;
      }
    }
    return null;
  };

  // Function to get or create a cart ID for unauthenticated users
  const getCartId = () => {
    let cartId = Cookies.get(CART_COOKIE_NAME);
    if (!cartId) {
      cartId = uuidv4();
      Cookies.set(CART_COOKIE_NAME, cartId, { expires: 7 }); // Expires in 7 days
    }
    return cartId;
  };

  // Function to fetch cart based on authentication status
  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const params = userId ? { userId } : { cartId: getCartId() };

      const response = await apiService.request({
        method: 'GET',
        url: '/cart/cart',
        params,
        requiresAuth: true,
      });

      setCart(response.cart);
    } catch (err) {
      console.error('Error fetching cart:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch the cart',
        type: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to add an item to the cart or update the quantity if it exists
  const addItemToCart = async (productId, quantity) => {
    setLoading(true);
    setError(null);

    try {
      const userId = getUserId();
      const cartId = userId ? null : getCartId();
      const existingItem = cart?.items.find((item) => item.productId === productId);

      if (existingItem) {
        // If the item exists, update its quantity
        const newQuantity = existingItem.quantity + quantity;

        const response = await apiService.request({
          method: 'PUT',
          url: '/cart/update',
          data: { userId, cartId, productId, quantity: newQuantity },
          requiresAuth: true, 
        });

        setCart(response.cart);
        toast({
          title: 'Success',
          description: 'Cart updated successfully',
          type: 'success',
        });
      } else {
        // If the item does not exist, add it to the cart
        const response = await apiService.request({
          method: 'POST',
          url: '/cart/add',
          data: { userId, cartId, productId, quantity },
          requiresAuth: true, 
        });

        setCart(response.cart);
        toast({
          title: 'Success',
          description: 'Item added to cart successfully',
          type: 'success',
        });
      }
    } catch (err) {
      setError('Failed to add/update item in the cart');
      toast({
        title: 'Error',
        description: 'Failed to add/update item in the cart',
        type: 'destructive',
      });
      console.error('Error adding/updating cart item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const userId = getUserId();
      const cartId = userId ? null : getCartId();

      const response = await apiService.request({
        method: 'DELETE',
        url: `/cart/remove`,
        data: { userId, cartId, productId },
        requiresAuth: true, 
      });

      setCart(response.cart);
      toast({
        title: 'Success',
        description: 'Item removed from cart',
        type: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from the cart',
        type: 'destructive',
      });
      console.error('Error removing item from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = async (productId, newQuantity) => {
    setLoading(true);

    try {
      const userId = getUserId();
      const cartId = userId ? null : getCartId();

      await apiService.request({
        method: 'PUT',
        url: '/cart/update',
        data: { userId, cartId, productId, quantity: newQuantity },
        requiresAuth: true, 
      });

      // Fetch the updated cart
      await fetchCart();

      toast({
        title: 'Success',
        description: 'Cart updated successfully',
        type: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity in the cart',
        type: 'destructive',
      });
      console.error('Error updating cart quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to merge carts when user logs in
  const mergeCarts = async () => {
    try {
      const userId = getUserId();
      const cartId = Cookies.get(CART_COOKIE_NAME);
      if (!userId || !cartId) return;

      const response = await apiService.request({
        method: 'POST',
        url: '/cart/merge',
        data: { userId, cartId },
        requiresAuth: true, 
      });

      setCart(response.cart);
      Cookies.remove(CART_COOKIE_NAME); // Remove cartId cookie after merging
      toast({
        title: 'Success',
        description: 'Carts merged successfully',
        type: 'success',
      });
    } catch (err) {
      console.error('Error merging carts:', err);
      toast({
        title: 'Error',
        description: 'Failed to merge carts',
        type: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCart();

    // Optional: Listen for authentication changes and merge carts accordingly
    // This depends on how your authentication state is managed (e.g., Context, Redux)
    // Example using a custom event:
    // window.addEventListener('login', mergeCarts);
    // return () => window.removeEventListener('login', mergeCarts);
  }, []);

  return {
    cart,
    loading,
    error,
    addItemToCart,
    removeItem,
    updateQuantity,
    fetchCart,
    mergeCarts,
  };
};

export default useCart;
