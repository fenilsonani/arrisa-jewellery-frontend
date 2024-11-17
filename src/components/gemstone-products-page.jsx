'use client'

import React, { useState, useEffect } from 'react'
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

export function GemStoneProducts() {
  const [gemstones, setGemstones] = useState([])
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

  const pageSizeOptions = [10, 20, 50, 100] // Define page size options

  const fetchGemstones = async () => {
    setLoading(true);
    try {
      let sort = undefined;
      if (sortOption === 'priceLowHigh') {
        sort = 'price_asc';
      } else if (sortOption === 'priceHighLow') {
        sort = 'price_desc';
      }

      const response = await axios.get('https://api.glimmerwave.store/api/v1/gemStones', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          type: filters.type !== 'all' ? filters.type : undefined,
          origin: filters.origin !== 'all' ? filters.origin : undefined,
          clarity: filters.clarity !== 'all' ? filters.clarity : undefined,
          colorGrade: filters.colorGrade !== 'all' ? filters.colorGrade : undefined,
          sort,
        }
      })

      setGemstones(response.data.gemstones)
      setFilterOptions(response.data.filterOptions) // Update filter options from the API response
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching gemstones:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGemstones()
  }, [pagination.page, pagination.limit, filters, sortOption])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value) => {
    setSortOption(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageSizeChange = (value) => {
    setPagination(prev => ({ ...prev, limit: parseInt(value), page: 1 }))
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
          {gemstones.map(gemstone => (
            <motion.div
              key={gemstone._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={gemstone.images[0] || '/placeholder.svg?height=200&width=200'}
                alt={gemstone.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{gemstone.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{gemstone.type}</p>
                <p className="text-lg font-bold mb-2">
                  ${(gemstone.pricePerCarat * gemstone.caratWeight).toFixed(2)}
                </p>
                <p className="text-sm">Origin: {gemstone.origin}</p>
                <p className="text-sm">Clarity: {gemstone.clarity}</p>
                <p className="text-sm">Color Grade: {gemstone.colorGrade}</p>
                <p className="text-sm">Carat Weight: {gemstone.caratWeight}</p>
                <p className="text-sm">Certification: {gemstone.certification.certifier}</p>
                <Link
                  href={`/products/gemstone/${gemstone._id}`}
                  passHref>
                  <Button
                    className="w-full mt-4">
                    View Details
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Pagination Controls */}
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
                  <AccordionTrigger>Gemstone Type</AccordionTrigger>
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
              <div className="mt-4 flex justify-end">
                <Button onClick={() => {
                  setFilters({
                    search: '',
                    type: 'all',
                    origin: 'all',
                    clarity: 'all',
                    colorGrade: 'all',
                  })
                  setIsFilterOpen(false)
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}>
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
