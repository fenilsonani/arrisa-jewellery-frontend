import { TermsAndConditions } from '@/components/terms-and-conditions'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Terms and Conditions | Glimmerwave',
        description: 'View our terms and conditions',
        keywords: 'terms, conditions, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Terms and Conditions | Glimmerwave',
            description: 'View our terms and conditions',
            type: 'website',
            url: 'https://glimmerwave.store/terms-and-condition',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },  
        twitter: {
            title: 'Terms and Conditions | Glimmerwave',
            description: 'View our terms and conditions',
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
      <TermsAndConditions />
    </div>
  )
}

export default page
