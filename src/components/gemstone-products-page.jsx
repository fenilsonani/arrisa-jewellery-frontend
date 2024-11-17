"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Menu } from 'lucide-react'
import axios from 'axios'

const gemstoneTypes = ['Emerald', 'Diamond', 'Ruby', 'Sapphire']
const origins = ['India', 'Colombia', 'Brazil', 'Zambia']
const clarities = ['VVS1', 'VVS2', 'VS1', 'VS2']
const colorGrades = ['D', 'E', 'F', 'G', 'H']
const certifiers = ['GIA', 'IGI', 'HRD']

export function ProductsPageComponent() {
  const [gemstones, setGemstones] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priceRange: [0, 10000],
    origin: 'all',
    clarity: 'all',
    colorGrade: 'all',
    caratWeight: [0, 5],
    certifier: 'all',
  })
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchGemstones = async () => {
    try {
      const response = await axios.get('https://api.glimmerwave.store/api/v1/gemStones')
      setGemstones(response.data.gemstones)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching gemstones:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGemstones()
  }, [])

  const filteredGemstones = gemstones.filter(gemstone => {
    const searchMatch = gemstone.name.toLowerCase().includes(filters.search.toLowerCase())
    const typeMatch = filters.type === 'all' || gemstone.type === filters.type
    const priceMatch = gemstone.pricePerCarat * gemstone.caratWeight >= filters.priceRange[0] &&
      gemstone.pricePerCarat * gemstone.caratWeight <= filters.priceRange[1]
    const originMatch = filters.origin === 'all' || gemstone.origin === filters.origin
    const clarityMatch = filters.clarity === 'all' || gemstone.clarity === filters.clarity
    const colorGradeMatch = filters.colorGrade === 'all' || gemstone.colorGrade === filters.colorGrade
    const caratWeightMatch = gemstone.caratWeight >= filters.caratWeight[0] &&
      gemstone.caratWeight <= filters.caratWeight[1]
    const certifierMatch = filters.certifier === 'all' || gemstone.certification.certifier === filters.certifier

    return searchMatch && typeMatch && priceMatch && originMatch && clarityMatch &&
      colorGradeMatch && caratWeightMatch && certifierMatch
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg overflow-y-auto">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Filters</h2>
              <Accordion
                type="multiple"
                defaultValue={['search', 'type', 'price', 'origin', 'clarity', 'colorGrade', 'caratWeight', 'certifier']}
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
                        {gemstoneTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
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
                        {origins.map(origin => (
                          <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
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
                        {clarities.map(clarity => (
                          <SelectItem key={clarity} value={clarity}>{clarity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
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
                        {colorGrades.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="caratWeight">
                  <AccordionTrigger>Carat Weight</AccordionTrigger>
                  <AccordionContent>
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={filters.caratWeight}
                      onValueChange={(value) => handleFilterChange('caratWeight', value)}
                      className="mt-2" />
                    <div className="flex justify-between text-sm mt-1">
                      <span>{filters.caratWeight[0]} ct</span>
                      <span>{filters.caratWeight[1]} ct</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="certifier">
                  <AccordionTrigger>Certifier</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.certifier}
                      onValueChange={(value) => handleFilterChange('certifier', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Certifiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Certifiers</SelectItem>
                        {certifiers.map(certifier => (
                          <SelectItem key={certifier} value={certifier}>{certifier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Luxury Gemstone Collection</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label={isFilterOpen ? "Close filters" : "Open filters"}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{filteredGemstones.length} gemstones found</p>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGemstones.map(gemstone => (
              <motion.div
                key={gemstone._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <img
                    src={gemstone.images[0] || 'https://via.placeholder.com/300'}
                    alt={gemstone.name}
                    className="w-full h-48 object-cover" />
                  <CardHeader>
                    <CardTitle className="text-lg">{gemstone.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">{gemstone.type}</p>
                    <p className="text-lg font-semibold mb-2">
                      ${(gemstone.pricePerCarat * gemstone.caratWeight).toFixed(2)}
                    </p>
                    <p className="text-sm">Origin: {gemstone.origin}</p>
                    <p className="text-sm">Clarity: {gemstone.clarity}</p>
                    <p className="text-sm">Color Grade: {gemstone.colorGrade}</p>
                    <p className="text-sm">Carat Weight: {gemstone.caratWeight}</p>
                    <p className="text-sm">Certification: {gemstone.certification.certifier}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full"
                      onClick={() => {
                        window.open(`/product/gemstone/${gemstone._id}`, '_blank')
                      }}
                    >View Details</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPageComponent