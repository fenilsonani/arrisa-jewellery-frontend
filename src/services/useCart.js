import { useState, useEffect } from 'react';
import apiService from './apiService'; // Update the path accordingly
import toast from 'react-hot-toast';

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the user's cart when the component mounts
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await apiService.request({
          method: 'GET',
          url: '/cart/cart',
        });
        setCart(response.cart);
      } catch (err) {
        console.error('Error fetching cart:', err);
        toast.error('Failed to fetch the cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Function to add an item to the cart or update the quantity if it exists
  const addItemToCart = async (productId, quantity) => {
    setLoading(true);
    setError(null);

    try {
      const existingItem = cart?.items.find((item) => item.productId === productId);

      if (existingItem) {
        // If the item exists, update its quantity
        const newQuantity = existingItem.quantity + quantity;

        const response = await apiService.request({
          method: 'PUT',
          url: '/cart/update',
          data: { productId, quantity: newQuantity },
        });

        setCart(response.cart);
        toast.success('Cart updated successfully');
      } else {
        // If the item does not exist, add it to the cart
        const response = await apiService.request({
          method: 'POST',
          url: '/cart/add',
          data: { productId, quantity },
        });

        setCart(response.cart);
        toast.success('Item added to cart successfully');
      }
    } catch (err) {
      setError('Failed to add/update item in the cart');
      toast.error('Failed to add/update item in the cart');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const response = await apiService.request({
        method: 'DELETE',
        url: `/cart/remove`,
        data: { productId },
      });

      setCart(response.cart);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item from the cart');
      console.error('Error removing item from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = async (productId, newQuantity) => {
    setLoading(true);
    try {
      await apiService.request({
        method: 'PUT',
        url: '/cart/update',
        data: { productId, quantity: newQuantity },
      });

      const updatedCart = { ...cart };
      const updatedItems = updatedCart.items.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      updatedCart.items = updatedItems;
      const total = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
      updatedCart.total = total;
      toast.success(updatedCart)
      setCart(updatedCart);

      toast.success('Cart updated successfully');
    } catch (err) {
      toast.error('Failed to update quantity in the cart');
      console.error('Error updating cart quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    addItemToCart,
    removeItem,
    updateQuantity,
  };
};

export default useCart;