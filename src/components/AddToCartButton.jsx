// app/components/AddToCartButton.js
'use client';

import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from '@/app/actions/cart'; // Adjust the import path as needed
import { useTransition } from 'react';

export function AddToCartButton({ productId, quantity = 1 }) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        toast.success('Item added to cart', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error('Failed to add item to cart', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Add to cart error:', error);
      }
    });
  };

  return (
    <Button
      className="flex-1 text-lg py-6 flex items-center justify-center"
      aria-label="Add to Cart"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <span className="flex items-center">
          <svg
            className="animate-spin w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Adding...
        </span>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
          Add to Cart
        </>
      )}
    </Button>
  );
}