"use client"

import apiService from '@/services/apiService'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const Logout = () => {

    useEffect(() => {

        const config = {
            method: 'POST',
            url: '/users/logout',
        }

        const response = apiService.request(config)

        if (response.status === 200) {
            localStorage.removeItem('token')
            toast.success('Logged out successfully')
        } else {
            toast.error('An error occurred')
        }

    }, [])

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
                        <Link href="/login" passHref>
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
