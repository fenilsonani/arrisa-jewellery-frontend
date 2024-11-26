'use client'

import React, { useState, useEffect } from 'react'
import {
  Star, ShoppingCart, Heart, Minus, Plus, MessageCircle, Eye, AlertCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Cookies from 'js-cookie'
import { addItem } from '@/store/cartSlice'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { ArrowRight } from 'lucide-react'
import { ArrowLeft } from 'heroicons-react'
import ProductCard from '@/components/all-product-card'
import { toast } from '@/hooks/use-toast'
import { AddToCartButton } from '@/components/AddToCartButton'

export default function JProductComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [productData, setProductData] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [isFloatingBarVisible, setIsFloatingBarVisible] = useState(false)
  const [viewersCount, setViewersCount] = useState(0)
  const [customizations, setCustomizations] = useState({ engraving: "", diamondQuality: "VS1", bandWidth: 2 })
  const [giftWrap, setGiftWrap] = useState(false)
  const [financingMonths, setFinancingMonths] = useState(12)
  const [relatedProducts, setRelatedProducts] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = window.location.pathname.split('/').pop();
        const url = `http://localhost:3005/api/v1/products/${productId}`;
        const response = await axios.get(url);
        setProductData(response.data.product);
        setRelatedProducts(response.data.relatedProducts);
        setIsLoading(false)
        setSelectedMaterial(response.data.product.materials[0]?.materialId);
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
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
      <main className="container mx-auto px-4 py-8" aria-busy="true" aria-live="polite">
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
      </main>
    )
  }

  if (!productData) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-2xl" role="alert">Product not found or an error occurred.</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section aria-labelledby="product-details">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-2 gap-4">
                {productData.images?.length > 0 ? (
                  productData.images.map((image, index) => (
                    <div key={index} className="grid gap-4">
                      <Zoom>
                        <Image
                          src={image}
                          alt={`${productData.name || 'Product'} - Image ${index + 1}`}
                          className="h-auto max-w-full rounded-lg"
                          width={500}
                          height={500}
                          loading="lazy"
                        />
                      </Zoom>
                    </div>
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <div className="md:hidden">
                <Carousel showArrows={true} showThumbs={true} showStatus={false} infiniteLoop={true} autoPlay={true} interval={5000} transitionTime={500} swipeable={true} emulateTouch={true} showIndicators={false}
                  // custom buttons for previous and next
                  renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                      <button type="button" onClick={onClickHandler} title={label} className="absolute top-1/2 left-1 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-100 text-black rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                      </button>
                    )
                  }
                  renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                      <button type="button" onClick={onClickHandler} title={label} className="absolute top-1/2 right-1 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-100 text-black rounded-full">
                        <ArrowRight className="w-6 h-6" />
                      </button>
                    )
                  }
                >
                  {
                    productData.images?.length > 0 ? (
                      productData.images.map((image, index) => (
                        <div key={index}>
                          <Zoom>
                            <Image
                              src={image}
                              alt={`${productData.name || 'Product'} - Image ${index + 1}`}
                              className="h-auto max-w-full rounded-lg"
                              width={500}
                              height={500}
                              loading="lazy"
                            />
                          </Zoom>
                        </div>
                      ))
                    ) : (
                      <p>No images available</p>
                    )
                  }
                </Carousel>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <header>
              <h1 className="text-4xl font-bold mb-2" id="product-title">{productData.name}</h1>
              <div className="flex items-center mb-4" aria-label={`Average rating ${averageRating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} aria-hidden="true" />
                ))}
                <span className="ml-2 text-sm text-gray-600">({productData.ratings?.length || 0} reviews)</span>
              </div>
            </header>
            <p className="text-gray-600">{productData.description}</p>
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-2xl font-semibold mb-4">Product Details</h3>
                <dl className="grid grid-cols-2 gap-4">
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
                    <dd>{productData.dimensions?.length}x{productData.dimensions?.width}x{productData.dimensions?.height} {productData.dimensions?.unit}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Customizable</dt>
                    <dd>{productData.customizable ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">${customPrice.toFixed(2)}</span>
              {productData.discountPercentage > 0 && (
                <span className="text-xl text-gray-500 line-through">${productData.basePrice.toFixed(2)}</span>
              )}
              {productData.discountPercentage > 0 && (
                <Badge variant="destructive" aria-label={`Save ${productData.discountPercentage}%`}>Save {productData.discountPercentage}%</Badge>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Material</h3>
              {/* <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial} aria-labelledby="material-selection">
                <div className="grid grid-cols-2 gap-2">
                  {
                    productData.materials && productData.materials.map((material) => (
                      <div key={material.materialId?._id} className="flex items-center">
                        <RadioGroupItem value={material.materialId?._id} id={`material-${material.materialId?._id}`} className="peer sr-only" aria-labelledby={`label-material-${material.materialId?._id}`} />
                        <Label
                          htmlFor={`material-${material?.materialId?._id}`}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {material?.materialId?.name} ({material?.materialId?.purity})
                        </Label>
                      </div>
                    ))}
                </div>
              </RadioGroup> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold" aria-live="polite">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(productData.stockQuantity, quantity + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="gift-wrap"
                checked={giftWrap}
                onCheckedChange={setGiftWrap}
                aria-checked={giftWrap}
                aria-label="Toggle gift wrapping"
              />
              <Label htmlFor="gift-wrap">Add Gift Wrapping (+$25)</Label>
            </div>
            <div className="flex space-x-4">
              {/* <Button className="flex-1 text-lg py-6" aria-label="Add to Cart"
                onClick={() => {
                  const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : []
                  Cookies.set('cart', JSON.stringify([...cart, { productId: productData._id, quantity }]))
                  alert('Added to cart')
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                Add to Cart
              </Button> */}
              <AddToCartButton productId={productData._id} quantity={quantity} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="p-6" aria-label="Add to Wishlist">
                      <Heart className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-sm text-gray-500 flex items-center" aria-label={`${viewersCount} people are viewing this product`}>
              <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              {viewersCount} people are viewing this product
            </div>
          </div>
        </div>
      </section >

      {/* Scrollable Sections */}
      < section className="mt-12" >
        {/* Gemstone Details Section */}
        <Card Card >
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Gemstone Details</h3>
            {productData.gemstones && productData.gemstones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productData.gemstones.map((gemstone, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <Image
                        src={gemstone.image}
                        alt={`${gemstone.name} gemstone`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        width={400}
                        height={400}
                        loading="lazy"
                      />
                      <h4 className="text-lg font-semibold">{gemstone.name}</h4>
                      <p>Carat: {gemstone.carat}</p>
                      <p>Quantity: {gemstone.quantity}</p>
                      <p>Clarity: {gemstone.clarity}</p>
                      <p>Color Grade: {gemstone.colorGrade}</p>
                      {gemstone.certification && (
                        <div>
                          <p>Certification: {gemstone.certification.certifier}</p>
                          <p>Certificate Number: {gemstone.certification.certificateNumber}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No gemstone information available for this product.</p>
            )}
          </CardContent>
        </Card >
      </section >

      <section className="mt-12">
        {/* Customer Reviews Section */}
        <Card>
          <CardContent className="p-4">
            {productData.ratings && productData.ratings.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{averageRating.toFixed(1)} out of 5</h3>
                    <div className="flex" aria-hidden="true">
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
                          <Progress value={percentage} className="w-48 h-2" aria-label={`${percentage.toFixed(0)}% of ${star} star ratings`} />
                          <span className="text-sm text-gray-600 w-8 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <ScrollArea className="h-[400px] pr-4" aria-label="Customer reviews">
                  {productData.reviews && productData.reviews.length > 0 ? (
                    productData.reviews.map((review, index) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold mr-2">{review.userId}</span>
                          <div className="flex" aria-hidden="true">
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
      </section>

      <section className="mt-12">
        {/* Supplier Information Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Supplier Information</h3>
            {productData.supplier ? (
              <div className="space-y-4">
                <p><strong>Name:</strong> {productData.supplier.name}</p>
                <p><strong>Contact Email:</strong> <a href={`mailto:${productData.supplier.contactEmail}`} className="text-blue-500 underline">{productData.supplier.contactEmail}</a></p>
                <p><strong>Contact Phone:</strong> <a href={`tel:${productData.supplier.contactPhone}`} className="text-blue-500 underline">{productData.supplier.contactPhone}</a></p>
                <div>
                  <strong>Address:</strong>
                  <address className="not-italic">
                    <p>{productData.supplier.address.street}</p>
                    <p>{productData.supplier.address.city}, {productData.supplier.address.state} {productData.supplier.address.zipCode}</p>
                    <p>{productData.supplier.address.country}</p>
                  </address>
                </div>
              </div>
            ) : (
              <p>Supplier information is not available for this product.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        {/* Sustainability Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Sustainability & Ethical Sourcing</h3>
            <div className="space-y-4">
              <p>We are committed to sustainable and ethical practices in our jewelry production:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>All gemstones are ethically sourced and conflict-free</li>
                <li>We use recycled precious metals in our jewelry whenever possible</li>
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
      </section>

      {/* Related Products Section */}
      <section className="mt-12" aria-labelledby="related-products">
        <h2 className="text-2xl font-bold mb-4" id="related-products">Related Products</h2>
        {relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No related products available.</p>
        )}
      </section>

      {/* Financing Options Section */}
      <section className="mt-12" aria-labelledby="financing-options">
        <Card>
          <CardHeader>
            <CardTitle id="financing-options">Financing Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Finance your purchase with easy monthly payments:</p>
            <div className="flex items-center space-x-4 mb-4">
              <Select
                value={financingMonths.toString()}
                onValueChange={(value) => setFinancingMonths(parseInt(value))}
                aria-label="Select financing duration in months"
              >
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

      {/* Floating Bar */}
      {
        isFloatingBarVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between" role="region" aria-label="Floating cart bar">
            <div>
              <h3 className="font-bold">{productData.name}</h3>
              <p className="text-2xl font-bold">${customPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <AddToCartButton productId={productData._id} quantity={quantity} />
            </div>
          </div>
        )
      }
      {/* Fixed Buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button className="rounded-full p-4" variant="secondary" aria-label="Chat with us">
          <MessageCircle className="w-6 h-6" aria-hidden="true" />
        </Button>
        {productData.stockQuantity === 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="rounded-full p-4" variant="destructive" aria-label="Out of stock notification">
                  <AlertCircle className="w-6 h-6" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Out of stock. Click to get notified when available.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </main >
  )
}
