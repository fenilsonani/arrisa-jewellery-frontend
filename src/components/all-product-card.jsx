// Import necessary modules
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaRing, FaLink, FaCrown } from 'react-icons/fa';
import { GiNecklace, GiEarrings, GiBroadsword } from 'react-icons/gi';

function ProductCard({ product }) {
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const displayedImage =
        (hovered && product.images[1] ? product.images[1] : product.images[0]) ||
        'https://picsum.photos/300/200?random=100';

    // Map product types to icons
    const typeIconMap = {
        Ring: <FaRing className="w-5 h-5 text-gray-500" />,
        Necklace: <GiNecklace className="w-5 h-5 text-gray-500" />,
        Bracelet: <FaLink className="w-5 h-5 text-gray-500" />,
        Earrings: <GiEarrings className="w-5 h-5 text-gray-500" />,
        Crown: <FaCrown className="w-5 h-5 text-gray-500" />,
        Sword: <GiBroadsword className="w-5 h-5 text-gray-500" />,
        // Add more types as needed
    };

    const typeIcon = typeIconMap[product.type] || null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <Link href={`/products/jewelery/${product._id}`} passHref>
                <span
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="block relative"
                >
                    <Image
                        src={displayedImage}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-60 transition-transform duration-300 hover:scale-105"
                    />
                    {product.isNew && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            New
                        </span>
                    )}
                    {product.isOnSale && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            Sale
                        </span>
                    )}
                </span>
            </Link>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {typeIcon}
                </div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-lg font-bold">${product.price?.toFixed(2)}</p>
                </div>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(product.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            {/* Star SVG path */}
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.916c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.049 9.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                        ({product.averageRating?.toFixed(1) || 'N/A'})
                    </span>
                </div>
                <Link href={`/products/jewelery/${product._id}`} passHref>
                    <Button className="w-full mt-4">View Details</Button>
                </Link>
            </div>
        </motion.div>
    );
}

export default ProductCard;
