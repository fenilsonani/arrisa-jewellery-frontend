import React from 'react';
import { AdvancedCartSystemComponent } from '@/components/advanced-cart-system';

export async function generateMetadata() {
    return {
        title: 'Cart | Glimmerwave',
        description: 'View your cart and checkout',
        keywords: 'cart, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Cart | Glimmerwave',
            description: 'View your cart and checkout',
            type: 'website',
            url: 'https://glimmerwave.store/cart',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'Cart | Glimmerwave',
            description: 'View your cart and checkout',
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

export default async function Cart() {
    return (
        <div>
            <AdvancedCartSystemComponent />
        </div>
    );
}