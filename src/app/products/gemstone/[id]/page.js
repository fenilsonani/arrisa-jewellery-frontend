// pages/jewelry-product.js

import { GemstoneProductDisplayComponent } from '@/components/gemstone-product-display';

export default function JewelryProductPage({ params }) {

  return (
    <div>
      <GemstoneProductDisplayComponent productId={params.id} />
    </div>
  );
}
