import { GemstoneProductDisplayComponent } from '@/components/gemstone-product-display';

export async function generateMetadata({ params }) {
  return {
    title: 'Gemstone Product | Glimmerwave',
    description: 'View our latest gemstone product',
    keywords: 'gemstone, glimmerwave, store, collection',
    openGraph: {
      title: 'Gemstone Product | Glimmerwave',
      description: 'View our latest gemstone product',
      type: 'website',
      url: `https://glimmerwave.store/products/gemstone/${params.id}`,
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: 'Gemstone Product | Glimmerwave',
      description: 'View our latest gemstone product',
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    icons: {
      icon: '/favicon.ico',
    },
    category: 'gemstone',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    referrer: 'origin-when-cross-origin',
  }
}

export default function JewelryProductPage({ params }) {

  return (
    <div>
      <GemstoneProductDisplayComponent productId={params.id} />
    </div>
  );
}
