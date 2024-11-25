'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Server Actions
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart
} from '@/app/actions/cart';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Shipping and Payment Constants
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 500,
    estimatedDays: '5-7 business days'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 1500,
    estimatedDays: '2-3 business days'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 2500,
    estimatedDays: 'Next business day'
  }
];

const PAYMENT_METHODS = [
  { id: 'credit', name: 'Credit/Debit Card' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'apple_pay', name: 'Apple Pay' }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/products/multipleIds"

// Main Checkout Component
export default function CheckoutPage() {
  const router = useRouter();

  // State Management
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [processingOrder, setProcessingOrder] = useState(false);

  // Form State
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    async function fetchCartItems() {
      try {
        // Get cart from server action
        const cart = await getCart()

        // Extract product IDs from cart
        const productIds = Object.keys(cart)

        if (productIds.length > 0) {
          // Fetch product details
          const response = await axios.post(API_URL, { ids: productIds })

          // Map products with their quantities
          const tempCart = response.data.products.map(product => ({
            ...product,
            quantity: cart[product._id] || 1,
            basePrice: product.basePrice
          }))

          setCartItems(tempCart)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching cart:", error)
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  // Calculate Totals
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShippingCost = () => {
    return SHIPPING_OPTIONS.find(
      method => method.id === shippingMethod
    )?.price || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingCost();
  };

  // Cart Item Management
  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartItemQuantity(productId, quantity);
      setCartItems(current =>
        current.map(item =>
          item._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(current =>
        current.filter(item => item._id !== productId)
      );
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // Order Placement
  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    try {
      // Validate inputs
      const { firstName, lastName, email, phone, address } = customerDetails;
      if (!firstName || !lastName || !email || !phone || !address.street) {
        toast.error('Please complete all required fields');
        setProcessingOrder(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        customerDetails,
        shippingMethod,
        paymentMethod,
        total: calculateTotal()
      };

      // Replace with your actual order creation API
      const response = await axios.post('/api/orders', orderData);

      // Redirect to order confirmation
      router.push(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      toast.error('Order placement failed');
      setProcessingOrder(false);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Render Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
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
                {cartItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          className="w-16 mx-2 text-center"
                          onChange={(e) => updateQuantity(
                            item._id,
                            parseInt(e.target.value)
                          )}
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
                    <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                    <TableCell>${(item.basePrice * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Checkout Details */}
        <Card>
          <CardHeader>
            <CardTitle>Checkout Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Customer Details */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={customerDetails.firstName}
                    onChange={(e) => setCustomerDetails(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={customerDetails.lastName}
                    onChange={(e) => setCustomerDetails(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Email Address"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <Label>Street Address</Label>
                <Input
                  value={customerDetails.address.street}
                  onChange={(e) => setCustomerDetails(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      street: e.target.value
                    }
                  }))}
                  placeholder="Street Address"
                />
              </div>

              {/* Shipping Method */}
              <div>
                <Label>Shipping Method</Label>
                <Select
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shipping Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_OPTIONS.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name} - ${(method.price / 100).toFixed(2)}
                        ({method.estimatedDays})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${(calculateSubtotal() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${(calculateShippingCost() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(calculateTotal() / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className="w-full mt-4"
                onClick={handlePlaceOrder}
                disabled={processingOrder}
              >
                {processingOrder ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}