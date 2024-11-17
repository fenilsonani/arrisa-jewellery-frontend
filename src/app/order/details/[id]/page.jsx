import OrderDetails from "@/components/order-details"
import apiService from "@/services/apiService"
import axios from "axios";

// export async function generateMetadata({ params }) {
//   /* const order = await axios.request({
//     url: `/orders/${params.id}`,
//     method: 'GET',
//   }); */

//   const order = await axios.get(`/orders/${params.id}`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     }
//   );

//   return {
//     title: `Order ${order.id} | Glimmerwave`,
//     description: `View your order details`,
//     keywords: 'order, details, glimmerwave, store, collection',
//     openGraph: {
//       title: `Order ${order.id} | Glimmerwave`,
//       description: `View your order details`,
//       type: 'website',
//       url: `https://glimmerwave.store/order/details/${order.id}`,
//       images: [
//         'https://glimmerwave.store/default-blog-image.jpg',
//       ],
//     },
//     twitter: {
//       title: `Order ${order.id} | Glimmerwave`,
//       description: `View your order details`,
//       images: [
//         'https://glimmerwave.store/default-blog-image.jpg',
//       ],
//     },
//     icons: {
//       icon: '/favicon.ico',
//     },
//     category: 'order',
//     robots: 'index, follow',
//     viewport: 'width=device-width, initial-scale=1.0',
//     referrer: 'origin-when-cross-origin',
//   }
// }

export default function OrderDetailPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails id={params.id} title={"Detail"} />
    </div>
  )
}