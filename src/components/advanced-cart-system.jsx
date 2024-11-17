'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIntersection } from 'react-use';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // For Next.js App Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Trash2, Plus, Minus } from 'lucide-react';
import RecommendedProduct from './recomnded-product';
import useCart from '../services/useCart'; // Use your actual path to useCart
import { ScrollArea } from './ui/scroll-area';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(5),
});

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
            src={item.productId.images[0]}
            alt={item.productId.name}
            width={50}
            height={50}
            className="rounded-md" />
          <span className="font-medium">{item.productId.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
            className="w-16 text-center" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>${(item.productId.price / 100).toFixed(2)}</TableCell>
      <TableCell>${((item.productId.price * item.quantity) / 100).toFixed(2)}</TableCell>
      <TableCell>
        <Button variant="destructive" size="sm" onClick={() => removeItem(item.productId._id)}>
          <Trash2 className="h-4 w-4" />
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
  const { cart, loading, addItemToCart, removeItem, updateQuantity } = useCart(); // Use cart hook
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  const router = useRouter(); // For navigation

  /* const fetchRecommendedProducts = async () => {

  } */

  /* useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const recommended = await fetchRecommendedProducts();
        setRecommendedProducts(recommended);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load recommended products',
          status: 'destructive',
        })
      }
    };

    loadRecommendedProducts();
  }, []); */

  const calculateSubtotal = () => {
    return cart?.items.reduce((total, item) => total + item.productId.price * item.quantity, 0) || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const wrapping = giftWrapping ? 500 : 0; // $5 for gift wrapping
    return subtotal + wrapping - (discount || 0);
  };

  const proceedToCheckout = () => {
    router.push('/checkout'); // Navigate to the checkout page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Advanced Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {cart?.items.map((item) => (
                      <CartItem
                        key={item.productId._id}
                        item={item}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                      />
                    ))}
                    {cart?.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Your cart is empty
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {recommendedProducts.map(product => (
                  <RecommendedProduct
                    data={product}
                    key={product.id}
                    addToCart={() => addItemToCart(product.id, 1)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Gift Wrapping</span>
                    <span>$5.00</span>
                  </div>
                )}
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
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <CouponCode applyCoupon={(code) => {
                toast({
                  title: 'Coupon applied',
                  description: `Coupon code ${code} applied successfully`,
                  status: 'success',
                })
              }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
