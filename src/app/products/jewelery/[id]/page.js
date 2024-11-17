// pages/jewelry-product.js

import { JProductComponent } from '@/components/j-product-page';

export default function JewelryProductPage({ params }) {

  return (
    <div>
      <JProductComponent productId={params.id} />
    </div>
  );
}
