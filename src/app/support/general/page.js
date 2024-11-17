import { Support } from '@/components/support'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'General Support | Glimmerwave',
        description: 'General support for Glimmerwave',
        keywords: 'support, glimmerwave, jewelry, store',
        openGraph: {
            title: 'General Support | Glimmerwave',
            description: 'General support for Glimmerwave',
            type: 'website',
            url: 'https://glimmerwave.store/support/general',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'General Support | Glimmerwave',
            description: 'General support for Glimmerwave',
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

const General = () => {
    return (
        <div>
            <Support />
        </div>
    )
}

export default General
