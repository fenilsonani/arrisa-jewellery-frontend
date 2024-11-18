import { BlogDetails } from '@/components/blog-details'
import apiService from '@/services/apiService';
import React from 'react'
import axios from 'axios'

const markdownToText = (markdown) => {
    return markdown.replace(/#+\s*(.+)/g, '$1').replace(/\n/g, ' ').trim();
}

export async function generateMetadata({ params }) {
    try {
        const config = {
            url: 'http://localhost:3005/api/v1/blog/' + params.id,
            method: 'GET'
        };
        const response = await axios.get(config.url);
        const blog = response.data.post;

        return {
            title: `${blog?.title} | Glimmerwave Blog`,
            description: markdownToText(blog?.content),
            keywords: blog?.tags?.join(', '),
            openGraph: {
                title: blog?.title,
                description: markdownToText(blog?.content),
                type: 'article',
                url: `https://glimmerwave.store/blog/${params.id}`,
                images: [
                    {
                        url: blog?.featuredImage || 'https://glimmerwave.store/default-blog-image.jpg',
                        width: 1200,
                        height: 630,
                        alt: blog?.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: blog?.title,
                description: markdownToText(blog?.content),
                images: [blog?.featuredImage || 'https://glimmerwave.store/default-blog-image.jpg'],
            },
            authors: [{ name: blog?.author?.name }], // Assuming the API returns author information
            publishedTime: blog?.publishedAt,
            modifiedTime: blog?.updatedAt,
        };
    } catch (error) {
        console.error('Error fetching blog metadata:', error);
        return {
            title: 'Blog Post | Glimmerwave',
            description: error.message,
        };
    }
}

const page = ({ params }) => {

    console.log(params.id)

    return (
        <div>
            <BlogDetails data={params.id} />
        </div>
    )
}


export default page