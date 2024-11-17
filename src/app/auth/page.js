import React from 'react';
import { AuthPageComponent } from '@/components/auth-page';

export async function generateMetadata() {
  return {
    title: 'Authentication | Glimmerwave',
    description: 'Authentication page',
    keywords: 'authentication, glimmerwave, store, collection',
    openGraph: {
      title: 'Authentication | Glimmerwave',
      description: 'Authentication page',
      type: 'website',
      url: 'https://glimmerwave.store/auth',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: 'Authentication | Glimmerwave',
      description: 'Authentication page',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    icons: {
      icon: '/favicon.ico',
    },
    category: 'auth',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    referrer: 'origin-when-cross-origin',
  }
}

export default async function Auth() {
    return (
        <div>
            <AuthPageComponent />
        </div>
    );
}