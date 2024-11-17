import OrderDetails from "@/components/order-details"
import apiService from "@/services/apiService"

export async function generateMetadata({ params }) {
  const order = await apiService.request({
    url: `/orders/${params.id}`,
    method: 'GET',
    requiresAuth: true, 
  });

  return {
    title: `Order ${order.id} | Glimmerwave`,
    description: `Order ${order.id} confirmation`,
    keywords: 'order, confirmation, glimmerwave, store, collection',
    openGraph: {
      title: `Order ${order.id} | Glimmerwave`,
      description: `Order ${order.id} confirmation`,
      type: 'website',
      url: `https://glimmerwave.store/order/confirmation/${order.id}`,
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    twitter: {
      title: `Order ${order.id} | Glimmerwave`,
      description: `Order ${order.id} confirmation`,
      images: [
        'https://glimmerwave.store/default-blog-image.jpg',
      ],
    },
    icons: {
      icon: '/favicon.ico',
    },
    category: 'order',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    referrer: 'origin-when-cross-origin',
  }
}

export default function OrderConfirmationPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails id={params.id} title={"Confirmed"} />
    </div>
  )
}