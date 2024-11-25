// app/components/Cart.js
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateItemQuantity } from '../store/cartSlice';

export default function Cart() {
  const items = useSelector(state => state.cart.items);
  
  const dispatch = useDispatch();

  const handleRemoveItem = productId => {
    dispatch(removeItem({ productId }));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateItemQuantity({ productId, quantity }));
  };

  return (
    <div>
      <h2>Cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.map(item => (
        <div key={item.productId}>
          <p>Product ID: {item.productId}</p>
          <p>
            Quantity:
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={e => handleUpdateQuantity(item.productId, Number(e.target.value))}
            />
          </p>
          <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
