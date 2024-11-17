'use client'

import { useState } from 'react';
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check } from 'lucide-react'

// Mock promotions data
const promotions = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Get 20% off on all summer items",
    code: "SUMMER20",
    expiryDate: "2023-08-31"
  },
  {
    id: 2,
    title: "New Customer Discount",
    description: "10% off on your first purchase",
    code: "NEWCUSTOMER10",
    expiryDate: "2023-12-31"
  },
  {
    id: 3,
    title: "Free Shipping",
    description: "Free shipping on orders over $50",
    code: "FREESHIP50",
    expiryDate: "2023-12-31"
  }
]

export function Promotions() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const PromotionCard = ({ promotion }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    })

    return (
      (<motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>{promotion.title}</CardTitle>
            <CardDescription>{promotion.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold">Code: {promotion.code}</p>
            <p>Expires: {promotion.expiryDate}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigator.clipboard.writeText(promotion.code)}>
              Copy Code
            </Button>
          </CardFooter>
        </Card>
      </motion.div>)
    );
  }

  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Current Promotions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {promotions.map(promotion => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
          <CardDescription>Subscribe to receive new promotion codes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mt-4 bg-green-100 text-green-800 border-green-300">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>You've been subscribed to our promotions newsletter!</AlertDescription>
        </Alert>
      )}
    </div>)
  );
}