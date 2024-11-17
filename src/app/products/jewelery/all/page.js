import JewelryProducts from '@/components/product-page'
import React from 'react'

export async function generateMetadata() {
  return {
    title: 'Jewelery | Glimmerwave',
    description: 'View our latest jewelery collection',
    keywords: 'jewelery, glimmerwave, store, collection',
    openGraph: {
      title: 'Jewelery | Glimmerwave',
      description: 'View our latest jewelery collection',
      type: 'website',
      url: 'https://glimmerwave.store/products/jewelery/all',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: 'Jewelery | Glimmerwave',
      description: 'View our latest jewelery collection',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    icons: {
      icon: '/favicon.ico',
    },
    category: 'jewelry',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    referrer: 'origin-when-cross-origin',
  }
}

function AllProduct() {
  return (
    <div>
      <JewelryProducts />
    </div>
  )
}

export default AllProduct
