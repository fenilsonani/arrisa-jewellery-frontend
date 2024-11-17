"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const ProductCard = ({ product }) => {
  
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={isHovered ? 'hoverImage' : 'image'}
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
          <button className="bg-[#e6ddd0] text-gray-800 px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCollection = ({ collectionName, collectionDescription, products }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{collectionName}</h2>
          <p className="text-gray-600 mb-4">{collectionDescription}</p>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="container mx-auto px-4 py-8 h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto h-full pr-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCollection;