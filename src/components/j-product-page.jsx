'use client'

import React, { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, Minus, Plus, Info, Maximize2, MessageCircle, Eye, Share2, Camera, Gift, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

// This would typically come from your API or props
const product = {
  name: "Exquisite Diamond Eternity Ring",
  description: "A breathtaking eternity ring featuring a continuous line of perfectly matched diamonds, symbolizing eternal love and commitment.",
  images: [
    "/placeholder.svg?height=1000&width=1000",
    "/placeholder.svg?height=1000&width=1000",
    "/placeholder.svg?height=1000&width=1000",
    "/placeholder.svg?height=500&width=500&text=Diamond+Close-up",
  ],
  type: "Ring",
  basePrice: 5000,
  discountPercentage: 10,
  materials: [{ materialId: "1", name: "Platinum", weight: 5, weightUnit: "g" }],
  gemstones: [{ gemstoneId: "1", name: "Diamond", image: "/placeholder.svg?height=100&width=100", carat: 2, quantity: 20 }],
  dimensions: { length: 20, width: 20, height: 3, unit: "mm" },
  customizable: true,
  stockQuantity: 10,
  ratings: [
    { userId: "1", score: 5 },
    { userId: "2", score: 4 },
    { userId: "3", score: 5 },
    { userId: "4", score: 5 },
    { userId: "5", score: 4 }
  ],
  reviews: [
    { userId: "User1", content: "Absolutely stunning! The diamonds catch the light beautifully, and the craftsmanship is impeccable.", createdAt: new Date('2023-05-15'), rating: 5 },
    { userId: "User2", content: "A true work of art. This ring exceeded all my expectations.", createdAt: new Date('2023-06-02'), rating: 5 },
    { userId: "User3", content: "The perfect symbol of eternal love. My partner was overjoyed!", createdAt: new Date('2023-07-10'), rating: 4 }
  ],
  sku: "RNG-000001",
  variants: ["Platinum", "White Gold", "Rose Gold"],
  sizes: ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8"],
  relatedProducts: [
    { id: "1", name: "Diamond Stud Earrings", image: "/placeholder.svg?height=200&width=200", price: 2000 },
    { id: "2", name: "Diamond Tennis Bracelet", image: "/placeholder.svg?height=200&width=200", price: 3500 },
    { id: "3", name: "Diamond Pendant Necklace", image: "/placeholder.svg?height=200&width=200", price: 1800 }
  ],
  certifications: ["GIA", "IGI", "AGS"],
  customerPhotos: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
  faqs: [
    { question: "What is the clarity of the diamonds?", answer: "Our diamonds are VS1 clarity, ensuring a high-quality appearance with no visible inclusions to the naked eye." },
    { question: "Is this ring resizable?", answer: "Yes, this ring can be resized up to two sizes larger or smaller." },
    { question: "What is your return policy?", answer: "We offer a 30-day return policy for all our jewelry items, provided they are in their original condition." }
  ],
  diamond: {
    carat: 1.5,
    cut: "Excellent",
    color: "D",
    clarity: "VVS1",
    certification: "GIA",
    certificateNumber: "GIA2345678",
  },
  relatedBlogPosts: [
    { id: 1, title: "The 4 Cs of Diamond Quality", excerpt: "Learn about the Cut, Color, Clarity, and Carat weight that determine a diamond's value.", image: "/placeholder.svg?height=200&width=300" },
    { id: 2, title: "How to Choose the Perfect Engagement Ring", excerpt: "Tips and tricks for selecting an engagement ring that will make her say yes!", image: "/placeholder.svg?height=200&width=300" },
    { id: 3, title: "The History of Diamond Eternity Rings", excerpt: "Discover the rich history and symbolism behind diamond eternity rings.", image: "/placeholder.svg?height=200&width=300" }
  ]
}

export default function JProductComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [productData, setProductData] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isFloatingBarVisible, setIsFloatingBarVisible] = useState(false)
  const [viewersCount, setViewersCount] = useState(0)
  const [customizations, setCustomizations] = useState({ engraving: "", diamondQuality: "VS1", bandWidth: 2 })
  const [giftWrap, setGiftWrap] = useState(false)
  const [financingMonths, setFinancingMonths] = useState(12)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setProductData(product)
      setIsLoading(false)
      setSelectedVariant(product.variants[0])
      setSelectedSize(product.sizes[4])
    }, 2000)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsFloatingBarVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(Math.floor(Math.random() * 20) + 10)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const calculateCustomPrice = () => {
    if (!productData) return 0
    let price = productData.basePrice - (productData.basePrice * productData.discountPercentage / 100)
    if (customizations.diamondQuality === "VVS2") price += 500
    if (customizations.diamondQuality === "VVS1") price += 1000
    price += (customizations.bandWidth - 2) * 100 // $100 per 0.1mm over 2mm
    if (giftWrap) price += 25
    return price
  }

  const customPrice = calculateCustomPrice()
  const averageRating = productData?.ratings ? productData.ratings.reduce((sum, rating) => sum + rating.score, 0) / productData.ratings.length : 0

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-2xl">Product not found or an error occurred.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {productData.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img src={image} alt={`${productData.name} - Image ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-12 h-12 text-white bg-black bg-opacity-50 p-2 rounded-full" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-1/2">
              <Carousel className="w-full">
                <CarouselContent>
                  {productData.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <img src={image} alt={`${productData.name} - Image ${index + 1}`} className="w-full h-auto object-contain" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </DialogContent>
          </Dialog>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Virtual Try-On
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{productData.name}</h1>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm text-gray-600">({productData.ratings?.length || 0} reviews)</span>
            </div>
          </div>
          <p className="text-gray-600">{productData.description}</p>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Diamond Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <div className="relative z-10">
                    <p className="text-3xl font-bold">{productData.diamond?.carat || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Carat Weight</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <div className="relative z-10">
                    <p className="text-3xl font-bold">{productData.diamond?.cut?.[0] || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Cut: {productData.diamond?.cut || 'N/A'}</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gray-400 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <div className="relative z-10">
                    <p className="text-3xl font-bold">{productData.diamond?.color || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Color:  {productData.diamond?.color === 'D' ? 'D (Colorless)' : productData.diamond?.color || 'N/A'}</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-400 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <div className="relative z-10">
                    <p className="text-3xl font-bold">{productData.diamond?.clarity || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Clarity</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600">Certification: {productData.diamond?.certification || 'N/A'} #{productData.diamond?.certificateNumber || 'N/A'}</p>
                <Button variant="link" className="p-0 h-auto text-sm">View Certificate</Button>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold">${customPrice.toFixed(2)}</span>
            {productData.discountPercentage > 0 && (
              <span className="text-xl text-gray-500 line-through">${productData.basePrice.toFixed(2)}</span>
            )}
            {productData.discountPercentage > 0 && (
              <Badge variant="destructive">Save {productData.discountPercentage}%</Badge>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Material</h3>
            <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
              <div className="flex space-x-2">
                {productData.variants.map((variant) => (
                  <div key={variant} className="flex items-center">
                    <RadioGroupItem value={variant} id={variant} className="peer sr-only" />
                    <Label
                      htmlFor={variant}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {variant}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Size</h3>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover w-10 h-10 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(productData.stockQuantity, quantity + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="gift-wrap" checked={giftWrap} onCheckedChange={setGiftWrap} />
            <Label htmlFor="gift-wrap">Add Gift Wrapping (+$25)</Label>
          </div>
          <div className="flex space-x-4">
            <Button className="flex-1 text-lg py-6">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="p-6">
                    <Heart className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            {viewersCount} people are viewing this product
          </div>
        </div>
      </div>
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="sizing">Sizing Guide</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="font-semibold">Type</dt>
                  <dd>{productData.type}</dd>
                </div>
                <div>
                  <dt className="font-semibold">SKU</dt>
                  <dd>{productData.sku}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Dimensions</dt>
                  <dd>{`${productData.dimensions?.length || 'N/A'}x${productData.dimensions?.width || 'N/A'}x${productData.dimensions?.height || 'N/A'} ${productData.dimensions?.unit || 'N/A'}`}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Materials</dt>
                  <dd>{productData.materials?.map(m => `${m.name} (${m.weight}${m.weightUnit})`).join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Gemstones</dt>
                  <dd>{productData.gemstones?.map(g => `${g.name} (${g.carat} carat, ${g.quantity})`).join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Customizable</dt>
                  <dd>{productData.customizable ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              {productData.ratings && productData.ratings.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{averageRating.toFixed(1)} out of 5</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">{productData.ratings.length} global ratings</p>
                    </div>
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = productData.ratings.filter(r => r.score === star).length
                        const percentage = (count / productData.ratings.length) * 100
                        return (
                          <div key={star} className="flex items-center">
                            <span className="text-sm text-gray-600 w-8">{star} star</span>
                            <Progress value={percentage} className="w-48 h-2" />
                            <span className="text-sm text-gray-600 w-8 text-right">{percentage.toFixed(0)}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <ScrollArea className="h-[400px] pr-4">
                    {productData.reviews && productData.reviews.length > 0 ? (
                      productData.reviews.map((review, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold mr-2">{review.userId}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600">{review.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No reviews yet. Be the first to review this product!</p>
                    )}
                  </ScrollArea>
                </>
              ) : (
                <p className="text-center text-gray-500">No ratings or reviews yet. Be the first to rate this product!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sizing">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Ring Size Guide</h3>
              <p className="mb-4">To find your ring size, follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Wrap a piece of string or paper around your finger</li>
                <li>Mark where the ends meet</li>
                <li>Measure the length in millimeters</li>
                <li>Use the chart below to find your ring size</li>
              </ol>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">US Size</th>
                    <th className="border p-2">Circumference (mm)</th>
                    <th className="border p-2">Diameter (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">4</td>
                    <td className="border p-2">46.8</td>
                    <td className="border p-2">14.9</td>
                  </tr>
                  <tr>
                    <td className="border p-2">5</td>
                    <td className="border p-2">49.3</td>
                    <td className="border p-2">15.7</td>
                  </tr>
                  <tr>
                    <td className="border p-2">6</td>
                    <td className="border p-2">51.9</td>
                    <td className="border p-2">16.5</td>
                  </tr>
                  <tr>
                    <td className="border p-2">7</td>
                    <td className="border p-2">54.4</td>
                    <td className="border p-2">17.3</td>
                  </tr>
                  <tr>
                    <td className="border p-2">8</td>
                    <td className="border p-2">57.0</td>
                    <td className="border p-2">18.1</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customization">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Personalize Your Ring</h3>
              <p className="mb-4">Make this ring truly unique by adding a personal touch:</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="engraving" className="block mb-2">Engraving (up to 20 characters)</Label>
                  <Input
                    type="text"
                    id="engraving"
                    value={customizations.engraving}
                    onChange={(e) => setCustomizations({...customizations, engraving: e.target.value})}
                    maxLength={20}
                    placeholder="Enter your engraving text"
                  />
                </div>
                <div>
                  <Label className="block mb-2">Diamond Quality</Label>
                  <RadioGroup value={customizations.diamondQuality} onValueChange={(value) => setCustomizations({...customizations, diamondQuality: value})}>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="VS1" id="VS1" />
                        <Label htmlFor="VS1">VS1 (Standard)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="VVS2" id="VVS2" />
                        <Label htmlFor="VVS2">VVS2 (+$500)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="VVS1" id="VVS1" />
                        <Label htmlFor="VVS1">VVS1 (+$1000)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="block mb-2">Ban
d Width</Label>
                  <Slider
                    value={[customizations.bandWidth]}
                    onValueChange={(value) => setCustomizations({...customizations, bandWidth: value[0]})}
                    max={4}
                    min={1}
                    step={0.1}
                    className="w-[60%]"
                  />
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Current width: {customizations.bandWidth.toFixed(1)}mm</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faq">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              {productData.faqs && productData.faqs.length > 0 ? (
                <Accordion type="single" collapsible>
                  {productData.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center text-gray-500">No FAQs available for this product.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sustainability">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Sustainability & Ethical Sourcing</h3>
              <div className="space-y-4">
                <p>We are committed to sustainable and ethical practices in our jewelry production:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>All diamonds are ethically sourced and conflict-free</li>
                  <li>We use recycled precious metals in our jewelry</li>
                  <li>Our packaging is made from 100% recycled materials</li>
                  <li>We support local communities in mining regions through various initiatives</li>
                </ul>
                <p>Learn more about our sustainability efforts and certifications:</p>
                <div className="flex space-x-4">
                  {productData.certifications && productData.certifications.length > 0 ? (
                    productData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">{cert} Certified</Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No certifications available for this product.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Photos</h2>
        {productData.customerPhotos && productData.customerPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {productData.customerPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Customer photo ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No customer photos available yet.</p>
        )}
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Complete the Look</h2>
        {productData.relatedProducts && productData.relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productData.relatedProducts.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <Button variant="outline" className="w-full mt-2">View Product</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No related products available.</p>
        )}
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productData.relatedBlogPosts && productData.relatedBlogPosts.length > 0 ? (
            productData.relatedBlogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <Button variant="link" className="p-0">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No related blog posts available.</p>
          )}
        </div>
      </section>
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Financing Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Finance your purchase with easy monthly payments:</p>
            <div className="flex items-center space-x-4 mb-4">
              <Select value={financingMonths.toString()} onValueChange={(value) => setFinancingMonths(parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="18">18 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-2xl font-bold">${(customPrice / financingMonths).toFixed(2)}/month</span>
            </div>
            <p className="text-sm text-gray-500">*Subject to credit approval. Terms and conditions apply.</p>
          </CardContent>
        </Card>
      </section>
      {isFloatingBarVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">{productData.name}</h3>
            <p className="text-2xl font-bold">${customPrice.toFixed(2)}</p>
          </div>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      )}
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button className="rounded-full p-4" variant="secondary">
          <MessageCircle className="w-6 h-6" />
        </Button>
        {productData.stockQuantity === 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="rounded-full p-4" variant="destructive">
                  <AlertCircle className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out of stock. Click to get notified when available.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}