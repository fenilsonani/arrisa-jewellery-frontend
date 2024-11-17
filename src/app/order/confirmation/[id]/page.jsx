import OrderDetails from "@/components/order-details"

export default function OrderConfirmationPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails id={params.id} title={"Confirmed"} />
    </div>
  )
}