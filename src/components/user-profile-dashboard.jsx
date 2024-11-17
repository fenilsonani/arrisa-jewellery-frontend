'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertCircle, CheckCircle2, X, Car } from 'lucide-react';
import apiService from '@/services/apiService'
import { Skeleton } from './ui/skeleton';
import toast from 'react-hot-toast';
import Link from 'next/link';

const profileSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
})

export default function UserProfileDashboard() {
  const [user, setUser] = useState()
  const [sessions, setSessions] = useState()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [addresses, setAddresses] = useState([]);
  const [tempAddress, setTempAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: '/users/me',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: ''
    };

    const data = await apiService.request(config)

    const ordersResponse = await apiService.request({
      method: 'GET',
      url: '/orders',
    });

    setOrders(ordersResponse?.orders);


    setUser(data?.user)
    setSessions(data?.sessions)
    setAddresses(data?.user.addresses);

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSessionTermination = async (sessionId) => {
    setLoading(true)
    setError(null)

    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `/users/sessions/${sessionId}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: ''
    };

    const response = await apiService.request(config)

    if (response?.status === 'success') {
      toast.success('Session terminated successfully')
      // update the sessions list
      window.location.reload()
    } else {
      // setError(response.message)
      toast.error(response.message)
    }

    setLoading(false)
  }

  const handleAddressAddition = async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/users/me/addresses',
      data: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
    };

    const response = await apiService.request(config)

    if(response){
      toast.success('Address added successfully')
      fetchData()
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Profile Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Skeleton */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32 mt-4" />
              </div>
            </CardContent>
          </Card>

          {/* Account Overview Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile Dashboard</h1>
      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details here</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...register('username')} value={user?.username} />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} value={user?.email} />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="mt-4" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`}
                      alt={user?.username} />
                    <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{user?.username}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}</p>
                  <p>
                    <div className='flex items-center space-x-2'>
                      <strong>Last Login:</strong>
                      {
                        sessions?.slice(0, 1).map((session) => (
                          <p>
                            {
                              new Date(session.createdAt).toLocaleDateString()
                            }
                          </p>
                        ))
                      }
                    </div>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-100 text-green-800 border-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>View Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order?.date?.toLocaleDateString()}</TableCell>
                      <TableCell>${order?.total?.toFixed(2)}</TableCell>
                      <TableCell>{order?.status}</TableCell>
                      <TableCell>
                        <Link href={`/order/details/${order.id}`}>
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Manage your saved addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {addresses?.map((address) => (
                    <motion.li
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold">{address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* form for adding new address */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>Add a new address to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street</Label>
                      <Input id="street"
                        value={tempAddress.street}
                        onChange={(e) => setTempAddress({ ...tempAddress, street: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city"
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state"
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode"
                        value={tempAddress.zipCode}
                        onChange={(e) => setTempAddress({ ...tempAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country"
                        value={tempAddress.country}
                        onChange={(e) => setTempAddress({ ...tempAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4" disabled={loading}
                    onClick={() => handleAddressAddition(tempAddress)}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Address
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your current login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {sessions?.map((session) => (
                  <motion.li
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{session.userAgent}</p>
                      <p className="text-sm text-gray-500">IP: {session.ipAddress}</p>
                      <p className="text-sm text-gray-500 flex gap-1">Created At:
                        <span className="">
                          <strong>Date : </strong>
                          {
                            new Date(session.createdAt).toLocaleDateString()
                          }
                        </span>
                        <span className="">
                          <strong> Time :</strong> {
                            new Date(session.createdAt).toTimeString()
                          }
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSessionTermination(session.id)}
                      disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      <span className="sr-only">Terminate Session</span>
                    </Button>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>)
  );
}