"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Cookies from 'js-cookie';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function AuthPageComponent() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const handleApiError = (error) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    toast.error(errorMessage, {
      duration: 4000,
      position: 'top-center',
    });
  };

  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3005/api/v1/users/login', data);
      toast.success('Logged in successfully', {
        duration: 3000,
        position: 'top-center',
      });
      localStorage.setItem('token', response.data.token);
      Cookies.set('token', response.data.token);
      window.dispatchEvent(new Event('storage'));
      router.push('/');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSignupSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3005/api/v1/users/register', data);
      toast.success('Account created successfully. Please log in.', {
        duration: 3000,
        position: 'top-center',
      });
      setActiveTab('login');
      signupForm.reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Login or create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}>
                <TabsContent value="login" className="mt-4">
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" {...loginForm.register('email')} />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <Input id="login-password" type="password" {...loginForm.register('password')} />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-4">
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="signup-username">Username</Label>
                        <Input id="signup-username" {...signupForm.register('username')} />
                        {signupForm.formState.errors.username && (
                          <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" {...signupForm.register('email')} />
                        {signupForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" {...signupForm.register('password')} />
                        {signupForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input id="signup-confirm-password" type="password" {...signupForm.register('confirmPassword')} />
                        {signupForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}