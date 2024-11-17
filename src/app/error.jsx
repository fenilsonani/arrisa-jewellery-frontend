'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw, Home, Send } from 'lucide-react'

export default function ErrorComponent({
  error,
  reset
}) {
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const router = useRouter()

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would send this feedback to your server
    console.log('Feedback submitted:', feedback)
    setFeedbackSubmitted(true)
  }

  const errorMessage = error?.message || "An unexpected error occurred"
  const errorDigest = error?.digest ? `Error ID: ${error.digest}` : null

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-red-600">500</CardTitle>
            <CardDescription className="text-xl text-center">Internal Server Error</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
              {errorDigest && (
                <p className="text-xs mt-2">{errorDigest}</p>
              )}
            </Alert>
            <p className="text-center mb-6">
              We're sorry, but something went wrong on our end. Our team has been notified and is working on the issue.
            </p>
            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Help us improve (optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you were doing when this error occurred"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Submit Feedback
                </Button>
              </form>
            ) : (
              <Alert className="bg-green-100 text-green-800 border-green-300">
                <AlertTitle>Thank you!</AlertTitle>
                <AlertDescription>Your feedback has been submitted successfully.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => reset()}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          If this error persists, please <Link href="/contact" className="text-blue-600 hover:underline">contact our support team</Link>.
        </p>
      </motion.div>
    </div>)
  );
}