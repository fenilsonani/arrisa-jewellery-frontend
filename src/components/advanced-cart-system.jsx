"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart
} from "@/app/actions/cart"
import axios from "axios"
import Link from "next/link"
import { TrashIcon } from "@radix-ui/react-icons"
import { Skeleton } from "./ui/skeleton"
import { PlusIcon } from "lucide-react"
import { MinusIcon } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/products/multipleIds"

function CartItemRow({ item, updateQuantity, removeItem }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Image
            src={item.images[0]}
            alt={item.name}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
          <span className="font-medium">{item.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateQuantity(item._id, Math.max(1, item.quantity - 1))
            }
          >
            <MinusIcon size={10} />
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={e =>
              updateQuantity(item._id, Math.max(1, parseInt(e.target.value)))
            }
            className="w-16 text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <PlusIcon size={10} />
          </Button>
        </div>
      </TableCell>
      <TableCell>${item.basePrice.toFixed(2)}</TableCell>
      <TableCell>${(item.basePrice * item.quantity).toFixed(2)}</TableCell>
      <TableCell>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem(item._id)}
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function SimplifiedCartUI() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

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

  const updateQuantity = async (id, quantity) => {
    try {
      // Update quantity via server action
      await updateCartItemQuantity(id, quantity)

      // Update local state
      setCartItems(currentItems =>
        currentItems.map(item =>
          item._id === id ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async id => {
    try {
      // Remove item via server action
      await removeFromCart(id)

      // Update local state
      setCartItems(currentItems => currentItems.filter(item => item._id !== id))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.basePrice * item.quantity,
      0
    )
  }

  const applyCoupon = () => {
    // Simplified coupon logic
    if (couponCode.toLowerCase() === "discount10") {
      setDiscount(calculateSubtotal() * 0.1) // 10% discount
    } else {
      setDiscount(0)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skeleton for Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {/* Replace table rows with skeletons */}
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Skeleton for Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>

            {/* Skeleton for Apply Coupon */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
                    <TableBody className="overflow-x-scroll min-w-full">
                      {cartItems.map(item => (
                        <CartItemRow
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
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(calculateSubtotal() - discount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Apply Coupon */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Apply Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon}>Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
