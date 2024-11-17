'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import apiService from '@/services/apiService';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';

const profileSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});

export default function UserProfileDashboard() {
  const queryClient = useQueryClient();
  
  const [tempAddress, setTempAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Fetch user data using React Query
  const { data: userData, isLoading: userLoading, error: userError } = useQuery(
    ['userProfile'],
    async () => {
      const response = await apiService.request({
        method: 'get',
        url: '/users/me',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    }
  );

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    ['orders'],
    async () => {
      const response = await apiService.request({
        method: 'GET',
        url: '/orders',
      });
      return response.data.orders;
    }
  );

  useEffect(() => {
    if (userData) {
      setValue('username', userData?.user?.username);
      setValue('email', userData?.user?.email);
    }
  }, [userData, setValue]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation(
    async (data) => {
      return await apiService.request({
        method: 'PUT',
        url: '/users/me',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        data
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
        toast.success('Profile updated successfully');
      },
      onError: () => {
        toast.error('Failed to update profile');
      }
    }
  );

  // Mutation for adding new address
  const addAddressMutation = useMutation(
    async (newAddress) => {
      return await apiService.request({
        method: 'POST',
        url: '/users/me/addresses',
        data: newAddress
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
        toast.success('Address added successfully');
        setTempAddress({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        });
      },
      onError: () => {
        toast.error('Failed to add address');
      }
    }
  );

  // Mutation for terminating session
  const terminateSessionMutation = useMutation(
    async (sessionId) => {
      return await apiService.request({
        method: 'DELETE',
        url: `/users/sessions/${sessionId}`,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userProfile']);
        toast.success('Session terminated successfully');
      },
      onError: () => {
        toast.error('Failed to terminate session');
      }
    }
  );

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleAddressAddition = () => {
    addAddressMutation.mutate(tempAddress);
  };

  if (userLoading || ordersLoading) {
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                      <Input id="username" {...register('username')} />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="mt-4" disabled={updateProfileMutation.isLoading}>
                    {updateProfileMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.user?.username}`}
                      alt={userData?.user?.username} />
                    <AvatarFallback>{userData?.user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{userData?.user?.username}</h2>
                    <p className="text-sm text-gray-500">{userData?.user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  {ordersData?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{new Date(order?.date).toLocaleDateString()}</TableCell>
                      <TableCell>${order?.total?.toFixed(2)}</TableCell>
                      <TableCell>{order?.status}</TableCell>
                      <TableCell>
                        <Link href={`/order/details/${order.id}`}>View</Link>
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
                  {userData?.user?.addresses?.map((address) => (
                    <motion.li
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold">
                        {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Form for adding a new address */}
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
                  <Button type="submit" className="mt-4" disabled={addAddressMutation.isLoading}
                    onClick={handleAddressAddition}>
                    {addAddressMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                {userData?.sessions?.map((session) => (
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
                        <span><strong>Date:</strong> {new Date(session.createdAt).toLocaleDateString()}</span>
                        <span><strong>Time:</strong> {new Date(session.createdAt).toLocaleTimeString()}</span>
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => terminateSessionMutation.mutate(session.id)}
                      disabled={terminateSessionMutation.isLoading}>
                      {terminateSessionMutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      <span className="sr-only">Terminate Session</span>
                    </Button>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
