// pages/suppliers.js

import SuppliersList from '@/components/SuppliersList';

export async function generateMetadata() {
    return {
        title: 'Suppliers | Glimmerwave',
        description: 'View our suppliers',
        keywords: 'suppliers, glimmerwave, jewelry, store',
        openGraph: {
            title: 'Suppliers | Glimmerwave',
            description: 'View our suppliers',
            type: 'website',
            url: 'https://glimmerwave.store/suppliers',
            images: [
                'https://glimmerwave.store/default-blog-image.jpg',
            ],
        },
        twitter: {
            title: 'Suppliers | Glimmerwave',
            description: 'View our suppliers',
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

export default function SuppliersPage() {
  return (
    <div>
      <SuppliersList />
    </div>
  );
}
