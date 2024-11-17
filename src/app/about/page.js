import { About } from '@/components/about'
import React from 'react'

export async function generateMetadata() {
  return {
    title: 'About | Glimmerwave',
    description: 'Learn more about Glimmerwave',
    keywords: 'about, glimmerwave, jewelry, store',
    openGraph: {
      title: 'About | Glimmerwave',
      description: 'Learn more about Glimmerwave',
      type: 'website',
      url: 'https://glimmerwave.store/about',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: 'About | Glimmerwave',
      description: 'Learn more about Glimmerwave',
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

const AboutPage = () => {
  return (
    <div>
      <About />
    </div>
  )
}

export default AboutPage
