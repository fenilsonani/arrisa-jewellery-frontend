'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation' // For Next.js 13+ with app directory
// For Next.js versions prior to 13 or using pages directory, use:
// import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter as FilterIcon } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import Link from 'next/link'
import qs from 'qs' // Install this package for query string manipulation: npm install qs

export function GemStoneProducts() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [gemstoneProducts, setGemstoneProducts] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    origin: 'all',
    clarity: 'all',
    colorGrade: 'all',
  })
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    origins: [],
    clarities: [],
    colorGrades: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  })
  const [sortOption, setSortOption] = useState('default')
  const [error, setError] = useState(null)

  const pageSizeOptions = [10, 20, 50, 100] // Define page size options

  // Ideally, store this in environment variables for flexibility
  const API_URL = 'http://localhost:3005/api/v1/gemstoneProducts'

  // Function to parse query parameters and set state accordingly
  const initializeFiltersFromURL = () => {
    const params = qs.parse(searchParams.toString())
    const {
      search = '',
      type = 'all',
      origin = 'all',
      clarity = 'all',
      colorGrade = 'all',
      sort = 'default',
      page = '1',
      limit = '20',
    } = params

    setFilters({
      search: Array.isArray(search) ? search[0] : search,
      type: Array.isArray(type) ? type[0] : type,
      origin: Array.isArray(origin) ? origin[0] : origin,
      clarity: Array.isArray(clarity) ? clarity[0] : clarity,
      colorGrade: Array.isArray(colorGrade) ? colorGrade[0] : colorGrade,
    })

    setSortOption(Array.isArray(sort) ? sort[0] : sort)
    setPagination(prev => ({
      ...prev,
      page: parseInt(Array.isArray(page) ? page[0] : page, 10) || 1,
      limit: parseInt(Array.isArray(limit) ? limit[0] : limit, 10) || 20,
    }))
  }

  // Function to update URL based on current state
  const updateURL = () => {
    const query = {
      search: filters.search || undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      origin: filters.origin !== 'all' ? filters.origin : undefined,
      clarity: filters.clarity !== 'all' ? filters.clarity : undefined,
      colorGrade: filters.colorGrade !== 'all' ? filters.colorGrade : undefined,
      sort: sortOption !== 'default' ? sortOption : undefined,
      page: pagination.page !== 1 ? pagination.page : undefined,
      limit: pagination.limit !== 20 ? pagination.limit : undefined,
    }

    const queryString = qs.stringify(query, { addQueryPrefix: true, skipNulls: true, arrayFormat: 'brackets' })
    router.push(`/products/gemstone/all/${queryString}`)
  }

  const fetchGemstones = async () => {
    setLoading(true)
    setError(null)
    try {
      let sort = undefined
      if (sortOption === 'priceLowHigh') {
        sort = 'price_asc'
      } else if (sortOption === 'priceHighLow') {
        sort = 'price_desc'
      }

      // Prepare query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        sort,
      }

      // Add filters only if they are not 'all'
      if (filters.type !== 'all') params.type = filters.type
      if (filters.origin !== 'all') params.origin = filters.origin
      if (filters.clarity !== 'all') params.clarity = filters.clarity
      if (filters.colorGrade !== 'all') params.colorGrade = filters.colorGrade

      // Debugging: Log the parameters being sent
      console.log('Fetching gemstones with params:', params)

      const response = await axios.get(API_URL, { params })

      // Debugging: Log the response data
      console.log('Received response:', response.data)

      setGemstoneProducts(response.data.gemstoneProducts)
      setFilterOptions(response.data.filterOptions) // Update filter options from the API response
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching gemstones:', error)
      setError('Failed to load gemstones. Please try again later.')
      setLoading(false)
    }
  }

  // Initialize filters from URL on component mount
  useEffect(() => {
    initializeFiltersFromURL()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch gemstones whenever filters, sortOption, page, or limit change
  useEffect(() => {
    fetchGemstones()
    // Update the URL whenever relevant state changes
    updateURL()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters, sortOption])

  // Listen to URL changes (e.g., browser back/forward) and update state
  useEffect(() => {
    const handleRouteChange = () => {
      initializeFiltersFromURL()
    }

    // For Next.js 13+ with app directory, there's no event for route changes in useRouter
    // Instead, use searchParams changes to trigger state updates
    // This assumes that useSearchParams is reactive to URL changes
    // If not, consider alternative approaches or use Next.js Router events if available

    // Cleanup function
    return () => {
      // Remove event listeners if any
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value) => {
    setSortOption(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageSizeChange = (value) => {
    setPagination(prev => ({ ...prev, limit: parseInt(value, 10), page: 1 }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      origin: 'all',
      clarity: 'all',
      colorGrade: 'all',
    })
    setSortOption('default')
    setPagination(prev => ({ ...prev, page: 1, limit: 20 }))
    setIsFilterOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        {/* Skeleton loaders */}
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <Skeleton className="h-10 w-64 mb-4 sm:mb-0" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Luxury Gemstone Collection</h1>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2 flex-grow sm:flex-grow-0">
              <Select
                value={sortOption}
                onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
                  <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="button flex items-center space-x-2"
                aria-label="Open filter options panel"
                aria-expanded={isFilterOpen}
                tabIndex={0}>
                <FilterIcon size={16} aria-hidden="false" className='mr-2' />
                Filters
              </Button>
            </SheetTrigger>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">{pagination.total} gemstones found</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Items per page:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {gemstoneProducts.length > 0 ? (
            gemstoneProducts.map(product => {
              const { gemstone } = product
              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[0]}
                      alt={gemstone.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt="Placeholder"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{gemstone.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{gemstone.gemStoneType}</p>
                    <p className="text-lg font-bold mb-2">
                      ${product?.priceAfterDiscount?.toFixed(2)}
                    </p>
                    <p className="text-sm">Origin: {gemstone.origin}</p>
                    <p className="text-sm">Clarity: {gemstone.clarity}</p>
                    <p className="text-sm">Color Grade: {gemstone.colorGrade}</p>
                    <p className="text-sm">Carat Weight: {gemstone.caratWeight}</p>
                    <Link
                      href={`/products/gemstone/${product._id}`}
                      passHref>
                      <Button
                        className="w-full mt-4">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <p className="col-span-full text-center text-gray-500">No gemstones found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8 items-center space-x-4">
            <Button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.pages) }))}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Filter Sheet Content */}
        <SheetContent
          className="w-[calc(100%-2rem)]">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your search</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-6rem)] pr-4">
              <Accordion
                type="multiple"
                defaultValue={['search', 'type', 'origin', 'clarity', 'colorGrade']}
                className="w-full">
                {/* Search Filter */}
                <AccordionItem value="search">
                  <AccordionTrigger>Search</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search gemstones..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-8" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Gemstone Type Filter */}
                <AccordionItem value="type">
                  <AccordionTrigger>Type</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => handleFilterChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {
                          filterOptions.types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                {/* Origin Filter */}
                <AccordionItem value="origin">
                  <AccordionTrigger>Origin</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.origin}
                      onValueChange={(value) => handleFilterChange('origin', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Origins" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Origins</SelectItem>
                        {
                          filterOptions.origins.map(origin => (
                            <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                {/* Clarity Filter */}
                <AccordionItem value="clarity">
                  <AccordionTrigger>Clarity</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.clarity}
                      onValueChange={(value) => handleFilterChange('clarity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Clarities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clarities</SelectItem>
                        {
                          filterOptions.clarities.map(clarity => (
                            <SelectItem key={clarity} value={clarity}>{clarity}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                {/* Color Grade Filter */}
                <AccordionItem value="colorGrade">
                  <AccordionTrigger>Color Grade</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.colorGrade}
                      onValueChange={(value) => handleFilterChange('colorGrade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Color Grades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Color Grades</SelectItem>
                        {
                          filterOptions.colorGrades.map(grade => (
                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
                  Close
                </Button>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </ScrollArea>
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default GemStoneProducts