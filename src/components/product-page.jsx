'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button" // Ensure this path is correct
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Menu, Star } from 'lucide-react'
import ProductCard from './product-card'
import { Checkbox } from '@/components/ui/checkbox' // Ensure this path is correct
import apiService from '@/services/apiService' // Ensure this path is correct

export function JProductsPageComponent() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 10000],
    minRating: 0,
    categories: [],
    brands: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  })
  const [sortOption, setSortOption] = useState('default') // Initialize with 'default'

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const config = {
        method: 'get',
        url: '/products',
        params: {
          page: pagination.page,
          limit: pagination.limit,
        }
      }
      const data = await apiService.request(config)
      setProducts(data.products)
      setProducts(data.products)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Extract unique categories and brands from products for filter options
  const categories = useMemo(() => {
    const cats = new Set()
    products.forEach(product => {
      if (product.category) cats.add(product.category)
    })
    return Array.from(cats)
  }, [products])

  const brands = useMemo(() => {
    const brs = new Set()
    products.forEach(product => {
      if (product.brand) brs.add(product.brand)
    })
    return Array.from(brs)
  }, [products])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories: updatedCategories }
    })
  }

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setFilters(prev => {
      const updatedBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
      return { ...prev, brands: updatedBrands }
    })
  }

  // Handle sort option change
  const handleSortChange = (value) => {
    setSortOption(value)
  }

  // Filter and sort products
  const sortedFilteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase())
      const priceMatch = product.price ? (
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      ) : true
      const ratingMatch = product.averageRating ? product.averageRating >= filters.minRating : true
      const categoryMatch = filters.categories.length > 0 ? filters.categories.includes(product.category) : true
      const brandMatch = filters.brands.length > 0 ? filters.brands.includes(product.brand) : true
      return searchMatch && priceMatch && ratingMatch && categoryMatch && brandMatch
    })

    // Apply sorting
    if (sortOption === 'priceLowHigh') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'priceHighLow') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortOption === 'ratingHighLow') {
      filtered.sort((a, b) => b.averageRating - a.averageRating)
    } else if (sortOption === 'nameAZ') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === 'nameZA') {
      filtered.sort((a, b) => b.name.localeCompare(a.name))
    }
    // No sorting for 'default'

    return filtered
  }, [products, filters, sortOption])

  // Handle loading state
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen container mx-auto">
      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg overflow-y-auto m-4 border-2 rounded-2xl">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Filters</h2>
              <Accordion
                type="multiple"
                defaultValue={['search', 'price', 'rating', 'category', 'brand']}
                className="w-full">

                {/* Search Filter */}
                <AccordionItem value="search">
                  <AccordionTrigger>Search</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-8" />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Range Filter */}
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      className="mt-2" />
                    <div className="flex justify-between text-sm mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Minimum Rating Filter */}
                <AccordionItem value="rating">
                  <AccordionTrigger>Minimum Rating</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={sortOption !== 'default' ? filters.minRating.toString() : '0'}
                      onValueChange={(value) => handleFilterChange('minRating', Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map(rating => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating === 0 ? 'Any' : `${rating} star${rating > 1 ? 's' : ''} and above`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                {/* Category Filter */}
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <Checkbox
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Brand Filter */}
                <AccordionItem value="brand">
                  <AccordionTrigger>Brand</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            checked={filters.brands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* Reset Filters Button */}
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setFilters({
                  search: '',
                  priceRange: [0, 10000],
                  minRating: 0,
                  categories: [],
                  brands: [],
                })}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Header with Title, Sort, and Filter Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Product Collection</h1>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Sort Option */}
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-gray-600" />
                <Select
                  value={sortOption}
                  onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem> {/* Updated value */}
                    <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
                    <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
                    <SelectItem value="ratingHighLow">Rating: High to Low</SelectItem>
                    <SelectItem value="nameAZ">Name: A-Z</SelectItem>
                    <SelectItem value="nameZA">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Filter Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label={isFilterOpen ? "Close filters" : "Open filters"}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Product Count */}
          <p className="text-sm text-muted-foreground mb-4">{sortedFilteredProducts.length} products found</p>

          {/* Product Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFilteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default JProductsPageComponent