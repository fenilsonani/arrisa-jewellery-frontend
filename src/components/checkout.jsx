'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertCircle, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useCart from '@/services/useCart'
import apiService from '@/services/apiService'
import { countries } from '../utils/countries.js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const shippingOptions = [
  { id: 'international', label: 'International Shipping', price: 2000, estimatedDays: '17-20' },
  { id: 'standard', label: 'Standard Shipping', price: 1000, estimatedDays: '10-15' },
  { id: 'semi-express', label: 'Semi-Express Shipping', price: 1500, estimatedDays: '8-10' },
  { id: 'express', label: 'Express Shipping', price: 2500, estimatedDays: '5-7' },
]

const baseSchema = {
  name: z.string().min(2, "Name is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
}

const schemaWithState = {
  ...baseSchema,
  state: z.string().min(2, "State is required"),
}

const createDynamicSchema = (requiresState) => {
  return z.object(requiresState ? schemaWithState : baseSchema)
}

function AddressForm({ onSubmit, initialData = {}, countries }) {
  const [requiresState, setRequiresState] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(createDynamicSchema(requiresState)),
    defaultValues: initialData,
  })

  const watchCountry = watch("country")

  useEffect(() => {
    setRequiresState(["US", "CA", "AU"].includes(watchCountry))
  }, [watchCountry])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" {...register('street')} />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register('city')} />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Select onValueChange={(value) => register('country').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
      </div>
      {requiresState && (
        <div>
          <Label htmlFor="state">State/Province</Label>
          <Input id="state" {...register('state')} />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
        </div>
      )}
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input id="postalCode" {...register('postalCode')} />
        {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
      </div>
      <Button type="submit">Save Address</Button>
    </form>
  )
}

function CheckoutForm({ cart, handlePlaceOrder, userAddresses }) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [shippingAddressId, setShippingAddressId] = useState(null)

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: calculateTotal(),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr)
        }
      })
    }
  }, [stripe])

  const calculateTotal = () => {
    const subtotal = cart?.items.reduce((total, item) => total + item.productId.price * item.quantity, 0) || 0
    const shippingCost = shippingOptions.find(option => option.id === shippingMethod)?.price || 0
    return subtotal + shippingCost
  }

  const handleAddressSelection = (address) => {
    setSelectedAddress(address)
    setIsNewAddress(false)
  }

  const handleNewAddress = async (data) => {
    try {
      const response = await apiService.request({
        method: 'POST',
        url: '/user/addresses',
        data,
      })
      setSelectedAddress(response.address)
      setIsNewAddress(false)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding new address:', error)
      toast.error('Failed to add new address. Please try again.')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !selectedAddress) {
      return
    }

    let paymentMethodId

    if (paymentMethod === 'card') {
      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      if (error) {
        toast.error(error.message)
        return
      }

      paymentMethodId = stripePaymentMethod.id
    }

    handlePlaceOrder({
      shippingAddress: selectedAddress,
      billingAddress: selectedAddress,
      paymentMethod,
      paymentMethodId,
      shippingMethod,
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <RadioGroup
          value={selectedAddress?._id}
          onValueChange={(value) => {
            const address = userAddresses.find((address) => address._id === value)
            handleAddressSelection(address)
          }}>
          {userAddresses.map((address) => (
            <div key={address.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem
                value={address.id}
                id={`address-${address.id}`}
                checked={selectedAddress?.id === address.id}
                onClick={() => handleAddressSelection(address)}
              />
              <Label htmlFor={`address-${address.id}`}>
                {address.name}, {address.street}, {address.city}, {address.country}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSubmit={handleNewAddress} countries={countries} />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
          {shippingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>
                {option.label} - ${(option.price / 100).toFixed(2)} ({option.estimatedDays} business days)
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            {paymentRequest && <SelectItem value="wallet">Google Pay / Apple Pay</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {paymentMethod === 'card' && (
        <div>
          <Label htmlFor="card-element">Credit or debit card</Label>
          <div className="border rounded-md p-3">
            <CardElement id="card-element" />
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="border rounded-md p-3 text-center">
          <p>You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}

      {paymentMethod === 'wallet' && paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}

      <div className="flex justify-between items-center font-semibold">
        <span>Total:</span>
        <span>${(calculateTotal() / 100).toFixed(2)}</span>
      </div>

      <Button type="submit" className="w-full" disabled={!stripe || !selectedAddress}>
        Place Order
      </Button>
    </form>
  )
}

export default function AdvancedCheckoutPage() {
  const router = useRouter()
  const { cart, loading } = useCart()
  const [processingOrder, setProcessingOrder] = useState(false)
  const [userAddresses, setUserAddresses] = useState([])

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await apiService.request({
          method: 'GET',
          url: '/users/me',
        })
        setUserAddresses(response.user.addresses)
      } catch (error) {
        console.error('Error fetching user addresses:', error)
        toast.error('Failed to load your addresses. Please try again.')
      }
    }

    fetchUserAddresses()
  }, [])

  const handlePlaceOrder = async (orderData) => {
    setProcessingOrder(true)
    try {
      const response = await apiService.request({
        method: 'POST',
        url: '/orders',
        data: {
          items: cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          ...orderData,
        },
      })

      router.push(`/order-confirmation/${response.order.id}`)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setProcessingOrder(false)
    }
  }

  if (loading || !cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.productId._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Image
                                src={item.productId.images[0]}
                                alt={item.productId.name}
                                width={50}
                                height={50}
                                className="rounded-md"
                              />
                              <span className="font-medium">{item.productId.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${(item.productId.price / 100).toFixed(2)}</TableCell>
                          <TableCell>${((item.productId.price * item.quantity) / 100).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm
                  cart={cart}
                  handlePlaceOrder={handlePlaceOrder}
                  userAddresses={userAddresses}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {processingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing your order...</span>
            </div>
          </div>
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </Elements>
  )
}