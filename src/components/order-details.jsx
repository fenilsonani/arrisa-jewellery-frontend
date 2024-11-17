"use client"
import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Loader2, MapPin, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import apiService from '@/services/apiService'
import toast from 'react-hot-toast'

function OrderDetails({ id, title }) {

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await apiService.request({
                    method: 'GET',
                    url: `/orders/${id}`,
                })
                setOrder(response.order)
                toast.success('Order loaded successfully!')
            } catch (err) {
                console.error(err)
                setError('Failed to load order details.')
                toast.error('Failed to load order details.')
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    if (loading) {
        return <OrderConfirmationSkeleton />
    }

    if (error) {
        return (
            <div className="container mx-auto mt-10">
                <p className="text-red-500">{error}</p>
                <Button asChild>
                    <Link href="/account/orders">Go Back to Orders</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 container mx-auto mt-10 px-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Order {title}</h1>
                    <p className="text-muted-foreground">Order #{order?._id}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
            </div>

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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.items?.map((item) => (
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
                                    <TableCell>${(item.priceAtPurchase / 100).toFixed(2)}</TableCell>
                                    <TableCell>${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                        <div className="space-y-2 text-right">
                            <div className="flex justify-between">
                                <span className="font-medium">Subtotal:</span>
                                <span>${(order?.totalAmount / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Shipping:</span>
                                <span>${(order?.shippingCost / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>${(order?.grandTotal / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                                {/* Assuming 'name' is not provided in the JSON, you might need to add it or remove it */}
                                {/* <p className="font-medium">{order?.shippingAddress?.name}</p> */}
                                <p>{order?.shippingAddress?.street}</p>
                                <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode}</p>
                                <p>{order?.shippingAddress?.country}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Order Date:</span>
                            <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Payment Method:</span>
                            <span>{order?.paymentMethod?.charAt(0).toUpperCase() + order?.paymentMethod?.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Payment Status:</span>
                            <span>{order?.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Order Status:</span>
                            <span>{order?.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Estimated Delivery:</span>
                            <div className="flex items-center space-x-1">
                                <Truck className="h-4 w-4" />
                                <span>{new Date(order?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center space-x-4">
                <Button asChild>
                    <Link href="/account/orders">View All Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}

function OrderConfirmationSkeleton() {
    return (
        <div className="space-y-8 animate-pulse container mx-auto mt-10 px-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-10 w-64 bg-gray-200 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded mt-2"></div>
                </div>
                <Loader2 className="h-12 w-12 text-gray-200 animate-spin" />
            </div>

            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="grid gap-8 md:grid-cols-2">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-center space-x-4">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

export default OrderDetails