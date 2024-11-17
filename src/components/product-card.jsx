'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button'; // Button component from your UI library
import { FaShoppingCart, FaHeart, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Icons for cart, wishlist, rating, and navigation
import useCart from '../services/useCart'; // Custom hook to manage cart state
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import Link from 'next/link';
import { Lens } from './ui/lens';

const ProductCard = ({ image, name, price, stockQuantity, averageRating, discountPercentage, product, index, _id }) => {

  const { addItemToCart, cart, loading, error } = useCart();

  // Calculate discounted price if applicable
  const discountedPrice = discountPercentage
    ? (price - (price * discountPercentage) / 100).toFixed(2)
    : price?.toFixed(2);

  // Render star ratings
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<FaStar key={i} className="text-yellow-500" />); // Optionally replace with a half-star icon
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <Link href={`/products/jewelery/${product._id}`}>
      <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white relative">
        {/* Badge for Discount */}
        {discountPercentage > 0 && (
          <div className="bg-red-500 text-white self-start text-xs px-2 py-1 z-10 rounded-full mb-2">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Product Image with Carousel */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden group">
          <div key={index} className="relative w-full h-64">
            <Lens>
              <Image
                src={image}
                alt={`${name} image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 ease-in-out group-hover:scale-105 object-center"
                placeholder="blur"
                blurDataURL="/placeholder.png" // Provide a low-res placeholder image
              />
            </Lens>
          </div>

          {/* Custom Navigation Buttons (Visible on Hover) */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
            {/* Previous Button */}
            <Button
              variant="ghost"
              className="hidden group-hover:flex items-center justify-center bg-black bg-opacity-50 text-white w-10 h-10 ml-2 rounded-full cursor-pointer pointer-events-auto hover:bg-opacity-75 transition-opacity"
              aria-label="Previous Slide"
              onClick={() => {
                // Access the carousel's instance and move to the previous slide
                const carousel = document.querySelector('.carousel .control-prev').click();
              }}
            >
              <FaChevronLeft />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              className="hidden group-hover:flex items-center justify-center bg-black bg-opacity-50 text-white w-10 h-10 mr-2 rounded-full cursor-pointer pointer-events-auto hover:bg-opacity-75 transition-opacity"
              aria-label="Next Slide"
              onClick={() => {
                // Access the carousel's instance and move to the next slide
                const indexOfCurrentSlide = Array.from(document.querySelectorAll('.carousel .slide')).findIndex(
                  (slide) => slide.classList.contains('selected')
                );
              }}
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

            {/* Star Ratings */}
            <div className="flex items-center mt-1">
              {
                // if there no rating then do not show the rating
                averageRating > 0 && renderStars()
              }
              {/* <span className="ml-2 text-sm text-gray-600">({averageRating?.toFixed(1)} / 5)</span> */}
              {
                // if there no rating then show the text "No rating"
                averageRating > 0 ? <span className="ml-2 text-sm text-gray-600">({averageRating?.toFixed(1)} / 5)</span> : ""
              }
            </div>
          </div>

          {/* Price and Discount */}
          <div className="mt-2">
            {discountPercentage ? (
              <div className="flex items-center">
                <span className="text-xl font-bold text-red-600 mr-2">${discountedPrice}</span>
                <span className="text-sm line-through text-gray-500">${price?.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">${price?.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Availability */}
          {stockQuantity > 0 ? (
            <span className="mt-2 text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="mt-2 text-sm text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 hover:border-red-500"
          >
            <FaHeart />
            Wishlist
          </Button>

          <Button
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={stockQuantity < 1}
            onClick={() => {
              addItemToCart(product._id, 1);
            }}
          >
            <FaShoppingCart />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;