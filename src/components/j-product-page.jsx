'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Maximize2,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Separator } from './ui/separator';
import axios from 'axios';
import Markdown from 'react-markdown';

// Define animation variants with a focus on luxury
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5, ease: 'easeIn' } },
};

// Simulated API call
async function getProduct(id) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.glimmerwave.store/api/v1/products/' + id,
    headers: {},
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data; // Adjusted to match the response structure
    })
    .catch((error) => {
      console.log(error);
    });
}

export function JProductComponent({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const shareUrl = `https://api.glimmerwave.store/product/${productId}`;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProduct(productId);
        setProduct(data.product); // Access the product object directly
        setLoading(false);
      } catch (err) {
        setError('Failed to load product data');
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          className="rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="h-screen flex items-center justify-center">Product not found</div>;
  }

  const discountedPrice = product.basePrice * (1 - (product.discountPercentage || 0) / 100);

  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div variants={itemVariants} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="aspect-square relative rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className={`transition-transform duration-500 ${isZoomed ? 'scale-110' : 'scale-100'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <motion.button
                whileHover="hover"
                whileTap="tap"
                className="absolute top-4 right-4 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md"
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Zoom Image"
              >
                <Maximize2 className="h-4 w-4 text-gray-800" />
              </motion.button>
            </motion.div>
          </AnimatePresence>

          {/* Previous Button */}
          <motion.div
            className="absolute top-[29%] left-4 transform -translate-y-1/2"
            variants={itemVariants}
          >
            <motion.button
              whileHover="hover"
              whileTap="tap"
              className="bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md"
              onClick={() =>
                setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))
              }
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-gray-800" />
            </motion.button>
          </motion.div>

          {/* Next Button */}
          <motion.div
            className="absolute top-[29%] right-4 transform -translate-y-1/2"
            variants={itemVariants}
          >
            <motion.button
              whileHover="hover"
              whileTap="tap"
              className="bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 shadow-md"
              onClick={() =>
                setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-gray-800" />
            </motion.button>
          </motion.div>

          {/* Thumbnail Buttons */}
          <motion.div className="flex justify-center mt-4 space-x-2" variants={itemVariants}>
            {product.images.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full border ${
                  index === currentImageIndex ? 'border-gold-500' : 'border-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                {index + 1}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Product Details */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Product Name and Price */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4">
              {product.discountPercentage > 0 && (
                <Badge variant="success" className="text-lg font-semibold">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-gray-800">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-gray-500 line-through">
                    ${product.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Specifications */}
          <motion.div className="grid grid-cols-2 gap-6" variants={containerVariants}>
            <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Type</h3>
              <p className="text-gray-600">{product.type}</p>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">SKU</h3>
              <p className="text-gray-600">{product.sku}</p>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Stock Quantity</h3>
              <p className="text-gray-600">{product.stockQuantity}</p>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Customizable</h3>
              <p className="text-gray-600">{product.customizable ? 'Yes' : 'No'}</p>
            </motion.div>
            {/* Materials */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md col-span-2"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Materials</h3>
              {product.materials && product.materials.length > 0 ? (
                <ul className="list-disc list-inside">
                  {product.materials.map((material, index) => (
                    <li key={index}>
                      {material.materialId?.name || 'Unknown Material'} - {material.weight}
                      {material.weightUnit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No materials</p>
              )}
            </motion.div>
            {/* Gemstones */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md col-span-2"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Gemstones</h3>
              {product.gemstones && product.gemstones.length > 0 ? (
                <ul className="list-disc list-inside">
                  {product.gemstones.map((gemstone, index) => (
                    <li key={index}>
                      {gemstone.gemstoneId?.name || 'Unknown Gemstone'} - Carat: {gemstone.carat}, Quantity: {gemstone.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No gemstones</p>
              )}
            </motion.div>
            {/* Supplier */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md col-span-2"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Supplier</h3>
              <p className="text-gray-600">{product.supplier?.name || 'Unknown Supplier'}</p>
            </motion.div>
            {/* Tags */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md col-span-2"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-700">Tags</h3>
              {product.tags && product.tags.length > 0 ? (
                <div className="flex space-x-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No tags</p>
              )}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="flex items-center space-x-4" variants={itemVariants}>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              className="flex-1 flex items-center justify-center py-3 rounded-lg transition-all duration-300 border-2 border-gold-500 text-gold-600 bg-gold-100"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center py-3 rounded-lg transition-all duration-300 border-2 border-gray-500 text-gray-600"
            >
              <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
            </motion.button>
          </motion.div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Facebook share URL
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  '_blank'
                );
              }}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Twitter share URL
                window.open(
                  `https://twitter.com/intent/tweet?url=${shareUrl}&text=${product.name}`,
                  '_blank'
                );
              }}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // LinkedIn share URL
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                  '_blank'
                );
              }}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Share API
                if (typeof navigator !== 'undefined' && navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: shareUrl,
                  });
                } else {
                  // Fallback
                  window.open(
                    `mailto:?subject=${encodeURIComponent(
                      product.name
                    )}&body=${encodeURIComponent(product.description + '\n\n' + shareUrl)}`
                  );
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>

          {/* Certification Section */}
          {product.certification && (
            <>
              <Separator />

              <motion.div className="grid grid-cols-12" variants={containerVariants}>
                <motion.div
                  className="col-span-12 flex items-center mb-4"
                  variants={itemVariants}
                >
                  <span className="text-gray-600 text-2xl font-bold">Certification</span>
                </motion.div>
                <motion.div
                  className="col-span-12 grid grid-cols-2 gap-6"
                  variants={containerVariants}
                >
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Certifier</h3>
                    <p className="text-gray-600">{product.certification.certifier}</p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">
                      Certificate Number
                    </h3>
                    <p className="text-gray-600">
                      {product.certification.certificateNumber}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-lg shadow-md"
                    variants={itemVariants}
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Date</h3>
                    <p className="text-gray-600">
                      {new Date(product.certification.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
      <Separator className="my-12" />
      <div className="prose prose-lg max-w-none">
        <Markdown>{product.description}</Markdown>
      </div>
    </motion.div>
  );
}
