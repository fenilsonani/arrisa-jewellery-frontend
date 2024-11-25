// app/components/AddToCartButton.js
'use client';
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react"; // Ensure lucide-react is installed
import { toast } from "react-toastify";
// import css of react toastify
import 'react-toastify/dist/ReactToastify.css';

export function AddToCartButton({ productId, quantity }) {
  const handleAddToCart = () => {
    let cart = [];
    const cartCookie = Cookies.get('cart');

    if (cartCookie) {
      try {
        // Attempt to decode the cookie in case it's URL-encoded
        const decodedCart = decodeURIComponent(cartCookie);
        cart = JSON.parse(decodedCart);
      } catch (error) {
        console.error('Failed to parse cart cookie:', error);
        toast.error('Failed to load cart. Clearing corrupted cart data.');
        Cookies.remove('cart'); // Clear the corrupted cookie
        cart = [];
      }
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      // Update the quantity of the existing product
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add the new product to the cart
      cart.push({ productId, quantity });
    }

    // Save the updated cart back to cookies with encoding
    try {
      Cookies.set('cart', encodeURIComponent(JSON.stringify(cart)), { expires: 7 }); // Expires in 7 days
    } catch (error) {
      console.error('Failed to set cart cookie:', error);
      toast.error('Failed to update cart.');
      return;
    }

    toast.success('Product added to cart');
  };

  return (
    <Button
      className="flex-1 text-lg py-6 flex items-center justify-center"
      aria-label="Add to Cart"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
      Add to Cart
    </Button>
  );
}
