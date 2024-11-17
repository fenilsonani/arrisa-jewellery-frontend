'use client';
import { useEffect, useState, useCallback } from 'react';
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
import { Skeleton } from './ui/skeleton';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/utils/countries'; // Ensure this file exports an array of country objects
import debounce from 'lodash.debounce'; // Install lodash.debounce via npm or yarn

const profileSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});

export default function UserProfileDashboard() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [tempAddress, setTempAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Assume there's an API endpoint for updating user profile
      const response = await apiService.request({
        method: 'PUT',
        url: '/users/me',
        data,
        requiresAuth: true,
      });

      if (response?.status === 'success') {
        setUser(response.user);
        toast.success('Profile updated successfully');
        setSuccess('Profile updated successfully');
        reset(data); // Update form with new data
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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

      setUser(userResponse?.user);
      setSessions(userResponse?.sessions || []);
      setAddresses(userResponse?.user?.addresses || []);
      setOrders(ordersResponse?.orders || []);

      // Reset form default values
      reset({
        username: userResponse?.user?.username,
        email: userResponse?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSessionTermination = async (sessionId) => {
    setLoadingSession(true);
    setError(null);

    try {
      const response = await apiService.request({
        method: 'DELETE',
        url: `/users/sessions/${sessionId}`,
        requiresAuth: true, 
      });

      if (response?.status === 'success') {
        toast.success('Session terminated successfully');
        // Update the sessions list without reloading
        setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));
      } else {
        toast.error(response.message || 'Failed to terminate session');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingSession(false);
    }
  };

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
        // Update addresses list without reloading
        setAddresses((prevAddresses) => [...prevAddresses, response.address]);
        // Reset tempAddress
        setTempAddress({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        });
        // Reset form fields
        reset({
          username: user?.username,
          email: user?.email,
        });
      } else {
        toast.error('Failed to add address');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleAddressDeletion = async (addressId) => {
    setLoadingAddress(true);
    setError(null);
    setSuccess(null);

    try {
      await apiService.request({
        method: 'DELETE',
        url: `/users/me/addresses/${addressId}`,
        requiresAuth: true, 
      });

      toast.success('Address deleted successfully');
      // Update addresses list without reloading
      setAddresses((prevAddresses) => prevAddresses.filter((a) => a.id !== addressId));
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoadingAddress(false);
    }
  };

  const parseUserAgent = (userAgent) => {
    // Simple parsing to extract browser and OS
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('OPR')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
      browser = 'Opera';
    }

    if (userAgent.includes('Windows')) {
      os = 'Windows';
    } else if (userAgent.includes('Mac OS X')) {
      os = 'Mac OS X';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS';
    }

    return { browser, os };
  };

  // Debounced function to fetch city and state based on zip code and country
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
          setValue('city', place['place name']);
          setValue('state', place['state']);
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

  const handleCountryChange = (value) => {
    setTempAddress((prev) => ({ ...prev, country: value }));
    // Clear city and state when country changes
    setTempAddress((prev) => ({ ...prev, city: '', state: '' }));
    setValue('city', '');
    setValue('state', '');
  };

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile Dashboard</h1>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="sessions">Active Logins</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* Profile Tab Content */}
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
                      <Input id="username" {...register('username')} defaultValue={user?.username} />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} defaultValue={user?.email} />
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
                    <strong>Last Login:</strong> {sessions[0]?.createdAt ? new Date(sessions[0].createdAt).toLocaleString() : 'N/A'}
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
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <p className="text-gray-500">You have no orders yet.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>${order?.totalAmount?.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          <Link href={`/order/details/${order._id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          {/* Addresses Tab Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Manage your saved addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {addresses.length === 0 ? (
                    <p className="text-gray-500">You have no addresses yet.</p>
                  ) : (
                    addresses.map((address) => (
                      <motion.li
                        key={address.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold">
                          {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAddressDeletion(address.id)}
                            disabled={loadingAddress}>
                            Delete
                          </Button>
                          {/* Uncomment and implement handleAddressUpdate if needed */}
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddressUpdate(address.id)}
                            disabled={loadingAddress}>
                            Update
                          </Button> */}
                        </div>
                      </motion.li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Form for adding new address */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>Add a new address to your account</CardDescription>
              </CardHeader>
              <CardContent>
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
                        {...register('city')}
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register('state')}
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          {/* Sessions Tab Content */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your current login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-gray-500">No active sessions.</p>
                ) : (
                  sessions.map((session) => {
                    const { browser, os } = parseUserAgent(session.userAgent);
                    return (
                      <motion.li
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{browser} on {os}</p>
                          <p className="text-sm text-gray-500">IP: {session.ipAddress}</p>
                          <p className="text-sm text-gray-500">
                            Created At: {new Date(session.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleSessionTermination(session.id)}
                          disabled={loadingSession}>
                          {loadingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                          <span className="sr-only">Terminate Session</span>
                        </Button>
                      </motion.li>
                    );
                  })
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
