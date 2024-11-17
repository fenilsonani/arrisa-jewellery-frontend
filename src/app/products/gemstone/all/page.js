import { GemStoneProducts } from '@/components/gemstone-products-page'
import React from 'react'

export async function generateMetadata() {
  return {
    title: 'Gemstone | Glimmerwave',
    description: 'View our latest gemstone collection',
    keywords: 'gemstone, glimmerwave, store, collection',
    openGraph: {
      title: 'Gemstone | Glimmerwave',
      description: 'View our latest gemstone collection',
      type: 'website',
      url: 'https://glimmerwave.store/products/gemstone/all',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: 'Gemstone | Glimmerwave',
      description: 'View our latest gemstone collection',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    icons: {
      icon: '/favicon.ico',
    },
    category: 'gemstone',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    referrer: 'origin-when-cross-origin',
  }
}

function AllProduct() {
  return (
    <div>
      <GemStoneProducts />
    </div>
  )
}

export default AllProduct
