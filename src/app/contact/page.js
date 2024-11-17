import { Contact } from '@/components/contact'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Contact | Glimmerwave',
        description: 'Contact Glimmerwave',
        keywords: 'contact, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Contact | Glimmerwave',
            description: 'Contact Glimmerwave',
            type: 'website',
            url: 'https://glimmerwave.store/contact',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'Contact | Glimmerwave',
            description: 'Contact Glimmerwave',
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

const page = () => {
    return (
        <div>
            <Contact />
        </div>
    )
}

export default page
