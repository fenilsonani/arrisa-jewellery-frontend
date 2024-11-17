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
import { Star, Heart, ShoppingCart, Instagram, Facebook, Twitter, Gem, Award, Shield, Truck, RefreshCw, Gift, ChevronDown, Search, Menu, X, Mail, Phone, MapPin, Clock, DollarSign, Percent, ThumbsUp, Zap } from 'lucide-react'

const featuredProducts = [
  { id: 1, name: "Diamond Eternity Ring", price: 1999, image: "/placeholder.svg?height=300&width=300", rating: 4.9, category: "Rings" },
  { id: 2, name: "Sapphire Pendant Necklace", price: 899, image: "/placeholder.svg?height=300&width=300", rating: 4.7, category: "Necklaces" },
  { id: 3, name: "Emerald Cut Earrings", price: 1299, image: "/placeholder.svg?height=300&width=300", rating: 4.8, category: "Earrings" },
  { id: 4, name: "Ruby Tennis Bracelet", price: 2499, image: "/placeholder.svg?height=300&width=300", rating: 4.9, category: "Bracelets" },
  { id: 5, name: "Pearl Stud Earrings", price: 299, image: "/placeholder.svg?height=300&width=300", rating: 4.6, category: "Earrings" },
  { id: 6, name: "Gold Chain Necklace", price: 799, image: "/placeholder.svg?height=300&width=300", rating: 4.7, category: "Necklaces" },
  { id: 7, name: "Platinum Wedding Band", price: 1599, image: "/placeholder.svg?height=300&width=300", rating: 4.8, category: "Rings" },
  { id: 8, name: "Opal Cocktail Ring", price: 699, image: "/placeholder.svg?height=300&width=300", rating: 4.5, category: "Rings" },
]

const collections = [
  { id: 1, name: "Bridal Collection", image: "/placeholder.svg?height=400&width=600", description: "Timeless pieces for your special day" },
  { id: 2, name: "Vintage Inspired", image: "/placeholder.svg?height=400&width=600", description: "Classic designs with a modern twist" },
  { id: 3, name: "Contemporary Chic", image: "/placeholder.svg?height=400&width=600", description: "Bold and innovative jewelry for the modern woman" },
  { id: 4, name: "Men's Essentials", image: "/placeholder.svg?height=400&width=600", description: "Sophisticated accessories for the modern gentleman" },
]

const testimonials = [
  { id: 1, name: "Sarah Johnson", role: "Bride", content: "The engagement ring I purchased was absolutely stunning. The quality and craftsmanship exceeded my expectations!", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Michael Chen", role: "Anniversary Gift Buyer", content: "I was blown away by the selection and customer service. Found the perfect anniversary gift for my wife.", avatar: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Emily Rodriguez", role: "Fashion Enthusiast", content: "The jewelry pieces are not only beautiful but also incredibly versatile. I wear them for both casual and formal occasions.", avatar: "/placeholder.svg?height=100&width=100" },
]

const blogPosts = [
  { id: 1, title: "How to Choose the Perfect Engagement Ring", excerpt: "Discover expert tips on selecting an engagement ring that will take her breath away.", image: "/placeholder.svg?height=200&width=300" },
  { id: 2, title: "The History of Birthstones", excerpt: "Explore the fascinating origins and meanings behind each month's birthstone.", image: "/placeholder.svg?height=200&width=300" },
  { id: 3, title: "Caring for Your Fine Jewelry", excerpt: "Learn how to keep your precious jewelry pieces sparkling and in pristine condition.", image: "/placeholder.svg?height=200&width=300" },
]

const faqs = [
  { id: 1, question: "What is your return policy?", answer: "We offer a 30-day return policy on all unworn items. Please refer to our Returns & Exchanges page for more details." },
  { id: 2, question: "Do you offer resizing services?", answer: "Yes, we provide complimentary resizing for rings purchased from our store within the first 60 days of purchase." },
  { id: 3, question: "Are your diamonds ethically sourced?", answer: "Absolutely. We are committed to ethical sourcing and only work with suppliers who adhere to the Kimberley Process." },
  { id: 4, question: "Do you offer international shipping?", answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination." },
  { id: 5, question: "How do I determine my ring size?", answer: "We offer a printable ring sizer on our website, or you can visit our store for a professional fitting." },
]

const features = [
  {
    name: 'Handcrafted Quality',
    description: 'Each piece is meticulously crafted by our expert artisans.',
    icon: Gem,
  },
  {
    name: 'Ethically Sourced',
    description: 'We ensure all our materials are responsibly and ethically sourced.',
    icon: Shield,
  },
  {
    name: 'Lifetime Warranty',
    description: 'We stand behind our products with a comprehensive lifetime warranty.',
    icon: Award,
  },
  {
    name: 'Free Shipping',
    description: 'Enjoy free shipping on all orders over $500.',
    icon: Truck,
  },
  {
    name: 'Easy Returns',
    description: '30-day hassle-free returns for your peace of mind.',
    icon: RefreshCw,
  },
  {
    name: 'Gift Wrapping',
    description: 'Complimentary gift wrapping available for all purchases.',
    icon: Gift,
  },
]

const customizationOptions = [
  { id: 'metal', name: 'Metal Type', options: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum'] },
  { id: 'carat', name: 'Diamond Carat', options: ['0.5', '1.0', '1.5', '2.0'] },
  { id: 'clarity', name: 'Diamond Clarity', options: ['SI', 'VS', 'VVS', 'FL'] },
  { id: 'cut', name: 'Diamond Cut', options: ['Good', 'Very Good', 'Excellent', 'Ideal'] },
]

export default function AdvancedLandingPage() {
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

  const filteredProducts = activeCategory === 'All'
    ? featuredProducts
    : featuredProducts.filter(product => product.category === activeCategory)

  useEffect(() => {
    // Simulating a loading effect
    const timer = setTimeout(() => {
      document.body.classList.add('loaded')
    }, 1000)

    return () => clearTimeout(timer)
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
                    <Link href="/collections">
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
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Featured Products
            </h2>
            <Tabs defaultValue="All" className="mb-8">
              <TabsList className="justify-center">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Rings">Rings</TabsTrigger>
                <TabsTrigger value="Necklaces">Necklaces</TabsTrigger>
                <TabsTrigger value="Earrings">Earrings</TabsTrigger>
                <TabsTrigger value="Bracelets">Bracelets</TabsTrigger>
              </TabsList>
              <TabsContent value="All">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="rounded-lg"
                          />
                        </CardHeader>
                        <CardContent>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>${product.price}</CardDescription>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              {/* Repeat TabsContent for other categories (Rings, Necklaces, Earrings, Bracelets) */}
            </Tabs>
          </div>
        </section>

        {/* 4. Collections Showcase */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Our Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection, index) => (
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
              ))}
            </div>
          </div>
        </section>

        {/* 5. Custom Jewelry Designer */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Design Your Own Jewelry
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Custom+Jewelry+Preview"
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

        {/* 6. Virtual Try-On Experience */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Virtual Try-On Experience
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Virtual+Try-On+Demo"
                  alt="Virtual Try-On Demo"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">See How It Looks On You</h3>
                <p className="text-gray-600 mb-6">
                  Use our state-of-the-art virtual try-on technology to see how our jewelry looks on you before you buy. Simply upload a photo or use your device's camera to get started.
                </p>
                <Button>
                  Start Virtual Try-On
                </Button>
              </div>
            </div>
          </div>
        </section>

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
            <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
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
                  src="/placeholder.svg?height=400&width=600&text=Ethical+Sourcing"
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
                <Card key={post.id}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="object-cover w-full h-48"
                  />
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
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
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Stay updated with our latest collections and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="flex-grow"
                />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </div>
        </section>

        {/* 14. Instagram Feed and Social Proof */}
        <section className="bg-gray-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
              Follow Us on Instagram
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={`/placeholder.svg?height=300&width=300&text=Instagram+Post+${index + 1}`}
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
                <Link href="https://www.instagram.com/your_jewelry_store">
                  <Instagram className="h-4 w-4 mr-2" />
                  Follow on Instagram
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">
                We are passionate about creating beautiful, high-quality jewelry that celebrates life's special moments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/collections" className="hover:text-white">Shop</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/sizing" className="hover:text-white">Sizing Guide</Link></li>
                <li><Link href="/care" className="hover:text-white">Jewelry Care</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-white">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Twitter className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Your Jewelry Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}