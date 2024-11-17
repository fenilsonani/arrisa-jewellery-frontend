'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Simulated API call for search suggestions
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        // Replace this with an actual API call in a real application
        const mockSuggestions = [
          'Home',
          'Products',
          'About Us',
          'Contact',
          'Blog'
        ].filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
        setSuggestions(mockSuggestions)
      } else {
        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId);
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement actual search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
            <CardDescription className="text-xl text-center">Oops! Page Not Found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search our site</Label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Enter your search query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10" />
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {suggestions.length > 0 && (
                <ul className="bg-white border rounded-md shadow-sm">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/${suggestion.toLowerCase().replace(' ', '-')}`)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <Button type="submit" className="w-full">
                Search
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
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
          If you believe this is a mistake, please <Link href="/contact" className="text-blue-600 hover:underline">contact our support team</Link>.
        </p>
      </motion.div>
    </div>)
  );
}