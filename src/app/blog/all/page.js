import { AllBlogs } from '@/components/all-blogs'
import { BlogDetails } from '@/components/blog-details'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'All Blogs | Glimmerwave',
        description: 'Read our latest blog posts on Glimmerwave',
        keywords: 'blog, glimmerwave, technology, programming, development',
        openGraph: {
            title: 'All Blogs | Glimmerwave',
            description: 'Read our latest blog posts on Glimmerwave',
            type: 'website',
            url: 'https://glimmerwave.store/blog/all',
            images: [
                {
                    url: 'https://glimmerwave.store/default-blog-image.jpg',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            title: 'All Blogs | Glimmerwave',
            description: 'Read our latest blog posts on Glimmerwave',
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
            <AllBlogs />
        </div>
    )
}

export default page
