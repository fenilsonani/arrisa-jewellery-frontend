'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// Coupon Schema
const couponSchema = z.object({
  code: z.string().min(1, "Coupon code cannot be empty"),
});

function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Image
            src={item.images?.[0] || '/placeholder-image.svg'}
            alt={item.name}
            width={50}
            height={50}
            className="rounded-md"
          />
          <span className="font-medium">{item.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
            className="w-16 text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell>${(item.basePrice / 100).toFixed(2)}</TableCell>
      <TableCell>${((item.basePrice * item.quantity) / 100).toFixed(2)}</TableCell>
      <TableCell>
        <Button variant="destructive" size="sm" onClick={() => removeItem(item._id)}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CouponCode({ applyCoupon }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
  });

  const onSubmit = async (data) => {
    await applyCoupon(data.code);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Label htmlFor="coupon">Coupon Code</Label>
      <Input id="coupon" placeholder="Enter coupon code" {...register('code')} />
      {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
      <Button type="submit">Apply Coupon</Button>
    </form>
  );
}

export function AdvancedCartSystemComponent() {
  const [cartItems, setCartItems] = useState([]); // Array of product data with quantity
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  const router = useRouter();

  // Function to get cart from cookies
  const getCartFromCookies = () => {
    const cart = Cookies.get('cart');
    if (!cart) return [];
    return JSON.parse(decodeURIComponent(cart));
  };

  // Function to update cart in cookies
  const updateCartInCookies = (cart) => {
    Cookies.set('cart', encodeURIComponent(JSON.stringify(cart)));
  };

  // Load cart items from cookies
  const loadCartItems = () => {
    setLoading(true);
    const cart = getCartFromCookies(); // Array of product data with quantity
    setLoading(false);
  };

  // Load cart items on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  // Update quantity of a cart item
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const cart = getCartFromCookies();
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCartInCookies(updatedCart);
    setCartItems(updatedCart);
  };

  // Remove item from cart
  const removeItem = (productId) => {
    const cart = getCartFromCookies();
    const updatedCart = cart.filter((item) => item._id !== productId);
    updateCartInCookies(updatedCart);
    setCartItems(updatedCart);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  // Apply coupon
  const applyCoupon = async (code) => {
    // Implement coupon validation logic here
    // For demonstration, assume a flat $10 discount for any coupon code
    setDiscount(1000); // $10.00 in cents
    setCoupon(code);
    toast.success(`Coupon code "${code}" applied successfully`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <CartItem
                          key={item._id}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeItem={removeItem}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(calculateSubtotal() / 100).toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({coupon})</span>
                    <span>-${(discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(calculateTotal() / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={proceedToCheckout}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>

          {/* Apply Coupon */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <CouponCode applyCoupon={applyCoupon} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
