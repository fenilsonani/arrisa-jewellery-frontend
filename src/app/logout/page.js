"use client"

import apiService from '@/services/apiService'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import axios from 'axios'

// export async function generateMetadata() {
//   return {
//     title: 'Logout | Glimmerwave',
//     description: 'Logout of your Glimmerwave account',
//     keywords: 'logout, glimmerwave, jewelry, store',
//     openGraph: {
//       title: 'Logout | Glimmerwave',
//       description: 'Logout of your Glimmerwave account',
//       type: 'website',
//       url: 'https://glimmerwave.store/logout',
//       images: [
//         'https://glimmerwave.store/default-blog-image.jpg',
//       ],
//     },
//     twitter: {
//       title: 'Logout | Glimmerwave',
//       description: 'Logout of your Glimmerwave account',
//       images: [
//         'https://glimmerwave.store/default-blog-image.jpg',
//       ],
//     },
//     icons: {
//       icon: '/favicon.ico',
//     },
//     category: 'jewelry',
//     robots: 'index, follow',
//     viewport: 'width=device-width, initial-scale=1.0',
//     referrer: 'origin-when-cross-origin',
//   }
// }

const Logout = () => {

  const [done, setDone] = useState(false)

  useEffect(() => {
    /* if (done) {
      return
    } */
    const logoutUser = async () => {
      try {
        const response = await axios.post('https://api.glimmerwave.store/api/v1/users/logout', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 200) {
          localStorage.removeItem('token');
          toast.success('Logged out successfully');
          window.dispatchEvent(new Event('storage'));
          router.push('/');
          setDone(true)
        }
      } catch (error) {
        toast.error('An error occurred: ' + error.message);
        setDone(true)
      }
    };

    if (!done) {
      logoutUser();
    }
  }, [done]);


  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Logout Successful</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>
            <p className="text-center text-gray-600">
              You have been successfully logged out of your account.
            </p>
            <p className="text-center text-gray-600">
              Thank you for using our service.
            </p>
            <Link href="/auth" passHref>
              <Button className="mt-4 w-full">
                Log In Again
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Logout
