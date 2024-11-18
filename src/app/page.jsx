"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Heart, ShoppingCart, Instagram, Facebook, Twitter, Gem, Award, Shield, Truck, RefreshCw, Gift, ChevronDown, Search, Menu, X, Mail, Phone, MapPin, Clock, DollarSign, Percent, ThumbsUp, Zap } from 'lucide-react'
import HomeProduct from '@/components/home-product'
import apiService from '@/services/apiService'
import Markdown from 'react-markdown'
import NewsLetterSignUP from '@/components/news-letter-signup'


const testimonials = [
  { id: 1, name: "Sarah Johnson", role: "Bride", content: "The engagement ring I purchased was absolutely stunning. The quality and craftsmanship exceeded my expectations!", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Michael Chen", role: "Anniversary Gift Buyer", content: "I was blown away by the selection and customer service. Found the perfect anniversary gift for my wife.", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Emily Rodriguez", role: "Fashion Enthusiast", content: "The jewelry pieces are not only beautiful but also incredibly versatile. I wear them for both casual and formal occasions.", avatar: "/placeholder.svg?height=100&width=100" },
]

const faqs = [
  { id: 1, question: "What is your return policy?", answer: "We offer a 15-day return policy on all unworn items. Please refer to our Returns & Exchanges page for more details." },
  { id: 2, question: "Do you offer resizing services?", answer: "Yes, we provide complimentary resizing for rings purchased from our store within the first 60 days of purchase." },
  { id: 3, question: "Are your diamonds ethically sourced?", answer: "Absolutely. We are committed to ethical sourcing and only work with suppliers who adhere to the Kimberley Process." },
  { id: 4, question: "Do you offer international shipping?", answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination." },
  { id: 5, question: "How do I determine my ring size?", answer: "We offer a printable ring sizer on our website, or you can visit our store for a professional fitting." },
]


const customizationOptions = [
  { id: 'metal', name: 'Metal Type', options: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum'] },
  { id: 'carat', name: 'Diamond Carat', options: ['0.5', '1.0', '1.5', '2.0'] },
  { id: 'clarity', name: 'Diamond Clarity', options: ['SI', 'VS', 'VVS', 'FL'] },
  { id: 'cut', name: 'Diamond Cut', options: ['Good', 'Very Good', 'Excellent', 'Ideal'] },
]

const BlogPostCard = ({ post }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}>
    <Card className="h-full flex flex-col">
      <CardHeader>
        <img
          src={post.featuredImage}
          alt={post.title}
          width={300}
          height={200}
          className="rounded-lg mb-4 w-full" />
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Badge>{post.category}</Badge>
          <span className="text-sm text-muted-foreground">{
            // publishedAt
            new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link href={`/blog/${post.id}`}>
          <Button >Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
)

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [customization, setCustomization] = useState({
    metal: 'Yellow Gold',
    carat: '1.0',
    clarity: 'VS',
    cut: 'Excellent',
  })
  const [collections, setCollections] = useState([])
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [collectionError, setCollectionError] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredProductLoading, setFeaturedProductLoading] = useState(true)
  const [featuredError, setFeaturedError] = useState(null)
  const [newProducts, setNewProducts] = useState([])
  const [newLoading, setNewLoading] = useState(true)
  const [newError, setNewError] = useState(null)
  const [topRated, setTopRated] = useState([])
  const [topRatedLoading, setTopRatedLoading] = useState(true)
  const [topRatedError, setTopRatedError] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogError, setBlogError] = useState(null)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Handle newsletter subscription logic here
    console.log('Subscribed with email:', email)
    setEmail('')
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {

    const fetchCollections = async () => {
      const collectionConfig = {
        url: '/home/featured-collections',
        method: 'GET',
      }

      try {
        const collections = await apiService.request(collectionConfig)
        console.log(collections)
        setCollections(collections)
        setCollectionLoading(false)
      } catch (error) {
        setCollectionError(error)
      }
    }

    const fetchFeaturedProducts = async () => {
      try {
        const products = await apiService.request({
          url: '/home/featured-products',
          method: 'GET',
        })
        setFeaturedProducts(products.products)
        setFeaturedProductLoading(false)
      } catch (error) {
        setFeaturedError(error)
      }
    }

    const fetchNewProducts = async () => {
      try {
        const products = await apiService.request({
          url: '/home/new-products',
          method: 'GET',
        })
        setNewProducts(products.products)
        setNewLoading(false)
      } catch (error) {
        setNewError(error)
      }
    }

    const fetchTopRatedProducts = async () => {
      try {
        const products = await apiService.request({
          url: '/home/top-rated-products',
          method: 'GET',
        })
        setTopRated(products.products)
        setTopRatedLoading(false)
      } catch (error) {
        setBestSellersError(error)
      }
    }

    const loadBlogPosts = async () => {
      try {
        const posts = await apiService.request({
          url: '/home/blog-posts',
          method: 'GET',
        })
        setBlogPosts(posts)
        setBlogLoading(false)
      } catch (error) {
        setBlogError(error)
      }
    }

    fetchCollections()
    fetchFeaturedProducts()
    fetchNewProducts()
    fetchTopRatedProducts()
    loadBlogPosts()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* 2. Hero Section */}
        <section className="relative bg-gray-100 py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="gri d grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Exquisite Jewelry</span>
                  <span className="block text-primary">For Every Occasion</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500">
                  Discover our handcrafted collection of fine jewelry, designed to make every moment sparkle.
                </p>
                <div className="mt-10 flex gap-4">
                  <Button asChild>
                    <Link href="/products/jewelery/all">
                      Shop Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-64 sm:h-72 md:h-96 lg:h-full"
              >
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Featured Jewelry"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Featured Products */}
        {
          featuredProductLoading ? (
            <div>Loading featured products...</div>
          ) : featuredError ? (
            <div>Error loading featured products: {featuredError.message}</div>
          ) : (
            <HomeProduct title={"Featured"} products={featuredProducts} />
          )
        }

        {/* 4. Collections Showcase */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Our Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {
                collectionLoading ? (
                  <div>Loading collections...</div>
                ) : collectionError ? (
                  <div>Error loading collections: {collectionError.message}</div>
                ) : (
                  collections?.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          width={600}
                          height={400}
                          className="object-cover h-64 w-full"
                        />
                        <CardContent className="p-6">
                          <CardTitle className="text-2xl mb-2">{collection.name}</CardTitle>
                          <CardDescription>{collection.description}</CardDescription>
                          <Button className="mt-4" asChild>
                            <Link href={`/collections/${collection.id}`}>
                              Explore Collection
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )))
              }
            </div>
          </div>
        </section>

        {/* 4.5 New Products */}
        {/* <HomeProduct title={"New"} products={featuredProducts} /> */}
        {
          newLoading ? (
            <div>Loading new products...</div>
          ) : newError ? (
            <div>Error loading new products: {newError.message}</div>
          ) : (
            <HomeProduct title={"New"} products={newProducts} />
          )
        }


        {/* 5. Custom Jewelry Designer */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Design Your Own Jewelry
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/custom-jewelery.webp"
                  alt="Custom Jewelry Preview"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <form className="space-y-6">
                  {customizationOptions.map((option) => (
                    <div key={option.id}>
                      <Label htmlFor={option.id}>{option.name}</Label>
                      <select
                        id={option.id}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={customization[option.id]}
                        onChange={(e) => setCustomization({ ...customization, [option.id]: e.target.value })}
                      >
                        {option.options.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <Button className="w-full">
                    Create Your Custom Piece
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Top Rate  */}
        {
          topRatedLoading ? (
            <div>Loading best sellers...</div>
          ) : topRatedError ? (
            <div>Error loading best sellers: {bestSellersError.message}</div>
          ) : (
            <HomeProduct title={"Top Rated"} products={topRated} />
          )
        }

        {/* 7. Educational Resources */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Jewelry Education Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Gemstone Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Learn about the characteristics, origins, and meanings of various gemstones.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Read More</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Jewelry Care Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Discover how to properly care for and maintain your precious jewelry pieces.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Read More</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Buying Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Expert advice on choosing the perfect jewelry for any occasion or recipient.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Read More</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* 8. Customer Reviews and Testimonials */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              What Our Customers Say
            </h2>
            <Carousel className="w-9/12 md:w-1/2 mx-auto h-full">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="h-full">
                    <Card className="text-center">
                      <CardHeader>
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={100}
                          height={100}
                          className="rounded-full mx-auto"
                        />
                      </CardHeader>
                      <CardContent>
                        <blockquote className="italic mb-4">"{testimonial.content}"</blockquote>
                        <CardTitle>{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* 9. Sustainability and Ethical Sourcing */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Our Commitment to Sustainability
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/sustainable.jpg"
                  alt="Ethical Sourcing"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Ethically Sourced, Responsibly Crafted</h3>
                <p className="text-gray-600 mb-6">
                  We are committed to ethical sourcing and sustainable practices. Our jewelry is crafted using responsibly sourced materials, and we work closely with suppliers who share our values.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    Conflict-free diamonds
                  </li>
                  <li className="flex items-center">
                    <Gem className="h-5 w-5 text-primary mr-2" />
                    Recycled precious metals
                  </li>
                  <li className="flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    Eco-friendly packaging
                  </li>
                </ul>
                <Button className="mt-6">
                  Learn More About Our Practices
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Gift Guide */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Gift Guide
            </h2>
            <Tabs defaultValue="occasion">
              <TabsList className="justify-center mb-8">
                <TabsTrigger value="occasion">By Occasion</TabsTrigger>
                <TabsTrigger value="recipient">By Recipient</TabsTrigger>
                <TabsTrigger value="price">By Price</TabsTrigger>
              </TabsList>
              <TabsContent value="occasion">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['Birthday', 'Anniversary', 'Wedding', 'Graduation'].map((occasion) => (
                    <Card key={occasion}>
                      <CardHeader>
                        <CardTitle>{occasion}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">Shop Gifts</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="recipient">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['For Her', 'For Him', 'For Mom', 'For Dad'].map((recipient) => (
                    <Card key={recipient}>
                      <CardHeader>
                        <CardTitle>{recipient}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">Shop Gifts</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="price">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['Under $100', '$100-$500', '$500-$1000', 'Luxury'].map((priceRange) => (
                    <Card key={priceRange}>
                      <CardHeader>
                        <CardTitle>{priceRange}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">Shop Gifts</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 11. Blog and Jewelry Care Tips */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Latest from Our Blog
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* 12. FAQ */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 13. Newsletter Signup */}
        <NewsLetterSignUP />

        {/* 14. Instagram Feed and Social Proof */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Follow Us on Instagram
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["https://scontent-lga3-2.cdninstagram.com/v/t51.29350-15/461857689_508527735226660_566974246125833490_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0NDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=104&_nc_ohc=WUhg5B0KRtMQ7kNvgFssxb4&_nc_gid=d9646d761a0d42ca8df4670c9e4d8b45&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzQ2OTUxMDAwOTQ4MDM0ODc3MQ%3D%3D.3-ccb7-5&oh=00_AYBdwpFgSxL17yEn0Ju4mrXiwHY2bTQuFdDgsMe0IPIDQA&oe=672FF45B&_nc_sid=7a9f4b"].map((_, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={_}
                    alt={`Instagram Post ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="https://www.instagram.com/glimmer.wave/">
                  <Instagram className="h-4 w-4 mr-2" />
                  Follow on Instagram
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}