// pages/checkout.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from './ui/label';
import { countries } from '@/utils/countries';
// Server Actions
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart
} from '@/app/actions/cart';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import apiService from '@/services/apiService';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useForm } from 'react-hook-form';
import { PlusIcon } from 'lucide-react';
import debounce from 'lodash.debounce';

// Stripe setup
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Shipping and Payment Constants
const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 0, // in cents
    amount: 0,
    estimatedDays: '5-7 business days',
    estimate: {
      min: 3,
      max: 5,
    },
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 1500, // in cents
    estimatedDays: '2-3 business days',
    amount: 1500,
    estimate: {
      min: 2,
      max: 3,
    },
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 2500, // in cents
    estimatedDays: 'Next business day',
    amount: 2500,
    estimate: {
      min: 1,
      max: 1,
    },
  }
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card' },
  // You can add more payment methods if needed
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Main Checkout Component
export default function CheckoutPage() {
  const router = useRouter();

  // State Management
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        // Get cart from server action
        const cart = await getCart();

        // Extract product IDs from cart
        const productIds = Object.keys(cart);

        if (productIds.length > 0) {
          // Fetch product details
          const response = await axios.post(
            `${API_URL}/products/multipleIds`,
            { ids: productIds }
          );

          // Map products with their quantities and convert basePrice to cents
          const tempCart = response.data.products.map((product) => ({
            ...product,
            quantity: cart[product._id] || 1,
            basePrice: Math.round(product.basePrice * 100) // Convert to cents
          }));

          setCartItems(tempCart);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    }

    fetchCartItems();
    fetchData();
  }, []);

  // Calculate Totals
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.basePrice * item.quantity,
      0
    );
  };

  const calculateShippingCost = () => {
    return SHIPPING_OPTIONS.find((method) => method.id === shippingMethod)?.price || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingCost();
  };

  // Cart Item Management
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemQuantity(productId, quantity);
      setCartItems((current) =>
        current.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems((current) => current.filter((item) => item._id !== productId));
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // Order Placement with Stripe
  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    try {
      // Prepare line items for Stripe
      const lineItems = cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.images[0]], // Optional: first product image
          },
          unit_amount: item.basePrice, // Already in cents
        },
        quantity: item.quantity,
      }));

      // Add shipping as a line item
      const shippingOption = SHIPPING_OPTIONS.find(
        (method) => method.id === shippingMethod
      );

      if (shippingOption) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: shippingOption.name,
            },
            unit_amount: shippingOption.price, // Already in cents
          },
          quantity: 1,
        });
      }

      // Create Checkout Session
      const stripe = await stripePromise;
      const { data } = await axios.post(
        `${API_URL}/payment/create-checkout-session`,
        {
          lineItems,
          paymentMethod,
          shippingAddress: selectedAddress,
          shippingMethod,
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Order processing failed');
      console.error(error);
    } finally {
      setProcessingOrder(false);
    }
  };

  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const [userResponse, ordersResponse] = await Promise.all([
        apiService.request({
          method: 'GET',
          url: '/users/me',
          requiresAuth: true,
        }),
        apiService.request({
          method: 'GET',
          url: '/orders',
          requiresAuth: true,
        }),
      ]);

      // Adjust according to the actual response structure
      const user = userResponse.user || userResponse; // Adjust as needed
      const sessions = userResponse.sessions || [];
      const addresses = user.addresses || [];

      setUser(user);
      setSessions(sessions);
      setAddresses(addresses);
      setOrders(ordersResponse.orders || []);

      // Remove or define the `reset` function
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const [tempAddress, setTempAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [loadingAddress, setLoadingAddress] = useState(false);

  const handleAddressAddition = async (e) => {
    e.preventDefault();
    setLoadingAddress(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.request({
        method: 'POST',
        url: '/users/me/addresses',
        data: tempAddress,
        requiresAuth: true,
      });

      if (response) {
        toast.success('Address added successfully');
        fetchData();
      } else {
        toast.error('Failed to add address');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleCountryChange = (value) => {
    setTempAddress((prev) => ({ ...prev, country: value }));
    // Clear city and state when country changes
    setTempAddress((prev) => ({ ...prev, city: '', state: '' }));
  };

  const fetchCityState = useCallback(debounce(async (countryCode, zip) => {
    if (!countryCode || !zip) {
      return;
    }

    try {
      // Show a loading toast
      const toastId = toast.loading('Fetching location data...');
      const response = await fetch(`https://api.zippopotam.us/${countryCode}/${zip}`);

      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          const place = data.places[0];
          setTempAddress((prev) => ({
            ...prev,
            city: place['place name'],
            state: place['state'],
          }));
          toast.success('Location data fetched successfully', { id: toastId });
        } else {
          toast.error('No location data found for the provided ZIP code.', { id: toastId });
        }
      } else {
        toast.error('Invalid ZIP code or country code.', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to fetch location data.', { id: toastId });
    }
  }, 500), []); // 500ms debounce

  // Handler for zip code and country change
  const handleZipCodeChange = (e) => {
    const zip = e.target.value;
    const country = tempAddress.country;
    const countryObj = countries.find((c) => c.name === country);
    const countryCode = countryObj ? countryObj.code.toLowerCase() : '';

    setTempAddress((prev) => ({ ...prev, zipCode: zip }));

    // Fetch city and state if zip and country are valid
    if (zip.length >= 3) { // Adjust minimum length as needed
      fetchCityState(countryCode, zip);
    }
  };


  const [selectedAddress, setSelectedAddress] = useState(null);

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
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
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
                {cartItems.map((item) => (
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
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value))
                          }
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
                    <TableCell>
                      ${(item.basePrice * item.quantity / 100).toFixed(2)}
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
            {/* User Details */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">User Details</h2>
              <div className='grid grid-cols-7 gap-4'>
                <Input
                  type="text"
                  value={user?.username}
                  disabled
                  placeholder="Full Name"
                  className="mb-2 col-span-3"
                />
                <Input
                  type="email"
                  value={user?.email}
                  disabled
                  placeholder="Email"
                  className="mb-2 col-span-3"
                />
                <Button
                  variant="outline"
                  className="col-span-1"
                  onClick={() => router.push('/profile')}
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4 space-y-1">
              <label className="block font-medium mb-1">Shipping Address</label>
              <Select onValueChange={(value) => {
                setSelectedAddress(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.street} value={address.street}>
                      {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog>
              <DialogTrigger>
                <Button variant="outline" className="mb-5">
                  <PlusIcon className="mr-2 w-5 h-5" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddressAddition}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        value={tempAddress.street}
                        onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={tempAddress.zipCode}
                        onChange={handleZipCodeChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={tempAddress.country}
                        onValueChange={handleCountryChange}
                        required
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              <span className={`mr-2`}>{country.flag}</span>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="mt-4" disabled={loadingAddress}>
                    {loadingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Address
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Shipping Method */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Shipping Method</label>
                <Select
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shipping Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_OPTIONS.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name} - ${(method.price / 100).toFixed(2)} ({method.estimatedDays})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-medium mb-1">Payment Method</label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
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
