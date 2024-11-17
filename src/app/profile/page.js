import React from 'react';
import UserProfileDashboard from '@/components/user-profile-dashboard';
import apiService from '@/services/apiService';

export async function generateMetadata() {
    return {
        title: 'Profile | Glimmerwave',
        description: 'View your profile',
        keywords: 'profile, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Profile | Glimmerwave',
            description: 'View your profile',
            type: 'website',
            url: 'https://glimmerwave.store/profile',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'Profile | Glimmerwave',
            description: 'View your profile',
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

export default async function Auth() {

    return (
        <div>
            <UserProfileDashboard />
        </div>
    );
}