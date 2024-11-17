import CheckoutPage from '@/components/checkout'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Checkout | Glimmerwave',
        description: 'Checkout your cart',
        keywords: 'checkout, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Checkout | Glimmerwave',
            description: 'Checkout your cart',
            type: 'website',
            url: 'https://glimmerwave.store/checkout',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'Checkout | Glimmerwave',
            description: 'Checkout your cart',
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

const Checkout = () => {
  return (
    <div>
        <CheckoutPage />
    </div>
  )
}

export default Checkout
