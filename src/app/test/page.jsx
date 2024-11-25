"use client"
import { AddToCartButton } from '../../components/AddToCartButton';
import { useSelector } from 'react-redux';

export default function ProductPage() {

    const items = useSelector(state => state.cart.items);

    return (
        <div>
            <h1>Product Details for {"1234"}</h1>
            <AddToCartButton productId={"1234"} />
            {
                items.length > 0 && (
                    <div>
                        <h2>Cart</h2>
                        {items.map(item => (
                            <div key={item.productId}>
                                <p>Product ID: {item.productId}</p>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
