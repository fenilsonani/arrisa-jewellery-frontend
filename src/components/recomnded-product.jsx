import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';  // Import Button from your UI components
import { Input } from '@/components/ui/input';    // Import Input from your UI components
import { FaShoppingCart, FaHeart, FaStar, FaRegStar } from 'react-icons/fa';  // Import icons from react-icons

const RecommendedProduct = ({ data }) => {
    const {
        image,
        name,
        price,
        discountPercentage,
        averageRating,
        reviews,
        isAvailable,
        tags,
    } = data;

    // Calculate discounted price if applicable
    const discountedPrice = discountPercentage
        ? (price - (price * discountPercentage) / 100).toFixed(2)
        : price.toFixed(2);

    // Generate star ratings
    const renderStars = () => {
        if (!averageRating) return <span>No ratings</span>;
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating % 1 >= 0.5;
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === fullStars && halfStar) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            }
        }
        return stars;
    };

    return (
        <div className="flex flex-col p-4 border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-64">
                <Image
                    src={image}
                    alt={`${name} image`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                    placeholder="blur"
                    blurDataURL="/placeholder.png" // Provide a low-res placeholder image
                />
            </div>
            <div className="mt-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <div className="flex items-center mt-2">
                    {renderStars()}
                    <span className="ml-2 text-sm text-gray-600">({reviews.length} reviews)</span>
                </div>
                <div className="mt-2">
                    {discountPercentage ? (
                        <div className="flex items-center">
                            <span className="text-lg font-bold text-red-600 mr-2">${discountedPrice}</span>
                            <span className="text-sm line-through text-gray-500">${price.toFixed(2)}</span>
                            <span className="ml-2 text-sm text-green-600">-{discountPercentage}%</span>
                        </div>
                    ) : (
                        <span className="text-lg font-bold">${price.toFixed(2)}</span>
                    )}
                </div>
                {tags && tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                {!isAvailable && (
                    <span className="mt-2 text-sm text-red-500">Out of Stock</span>
                )}
            </div>

            {/* Wishlist and Add to Cart Buttons */}
            <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full">
                    <FaHeart className="mr-2" />
                    Add to Wishlist
                </Button>

                <Button
                    variant="primary"
                    className="w-full"
                    disabled={!isAvailable}  // Disable if not available
                >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default RecommendedProduct;