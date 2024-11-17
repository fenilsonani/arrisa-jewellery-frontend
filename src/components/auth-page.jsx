'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Component
export function AuthPageComponent() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();


  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
  });

  // Error and success handling functions
  const handleApiResponse = (response) => {
    if (response.error) {
      setError(response.error);
      setSuccess(null);
    } else {
      setError(null);
      setSuccess(response.message);
    }
  };

  // Login form submit handler
  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {

      let data = JSON.stringify({
        "email": loginForm.getValues('email'),
        "password": loginForm.getValues('password')
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.glimmerwave.store/api/v1/users/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = axios.request(config)
        .then((response) => {
          toast.success(response.data.message)
          localStorage.setItem('token', response.data.token)
          router.refresh()
          router.push('/')
        })
        .catch((error) => {
          toast.error(error.message)
          console.log(error);
        });


      handleApiResponse(response);
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Signup form submit handler
  const onSignupSubmit = async (data) => {

    setLoading(true);
    try {

      if (signupForm.getValues('password') !== signupForm.getValues('confirmPassword')) {
        throw new Error("Passwords don't match");
      }

      let data = JSON.stringify({
        "username": signupForm.getValues('username'),
        "email": signupForm.getValues('email'),
        "password": signupForm.getValues('password')
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.glimmerwave.store/api/v1/users/register',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = axios.request(config)
        .then((response) => {
          toast.success(response.data.message)
        })
        .catch((error) => {
          toast.error(error)
          console.log(error);
        });

      handleApiResponse(response);
    } catch (error) {
      console.log(error);
      setError('An unexpected error occurred.' + error);
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
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
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
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign Up
                    </Button>
                  </form>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  );
}
