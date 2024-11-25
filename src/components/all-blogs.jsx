'use client';
import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInView } from 'react-intersection-observer'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Search, SortAsc, SortDesc, Sun, Moon, Rss } from 'lucide-react';
import Masonry from 'react-masonry-css'
import NewsLetterSignUP from './news-letter-signup';
import Link from 'next/link';
import axios from 'axios';

// Mock data for blog posts
const generateMockPosts = (count) => {
  const categories = ['Web Development', 'Mobile Development', 'AI & Machine Learning', 'DevOps', 'Cybersecurity']
  const tags = ['JavaScript', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes', 'TensorFlow', 'AWS', 'Azure', 'GraphQL']

  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Blog Post ${i + 1}`,
    excerpt: `This is a short excerpt for blog post ${i + 1}. It gives a brief overview of the content.`,
    author: `Author ${i % 5 + 1}`,
    date: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
    category: categories[i % categories.length],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    readTime: Math.floor(Math.random() * 10) + 5,
    image: `/placeholder.svg?height=200&width=300&text=Blog+${i + 1}`
  }));
}

const mockPosts = generateMockPosts(100)

export function AllBlogs() {
  const [posts, setPosts] = useState(generateMockPosts(100))
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [layout, setLayout] = useState('grid')
  // const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const parentRef = useRef()

  const rowVirtualizer = useVirtualizer({
    count: filteredPosts?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  })

  const [ref, inView] = useInView({
    threshold: 0,
  })

  useEffect(() => {
    const fetchBlogs = async () => {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3005/api/v1/blog/'
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setPosts(response.data.posts)
        })
        .catch((error) => {
          console.log(error);
        });

    }

    fetchBlogs()
    setMounted(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  useEffect(() => {
    let result = posts

    if (searchQuery) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.category.toLowerCase().includes(searchQuery.toLowerCase()) || post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory)
    }

    result?.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
    })

    if (sortOrder === 'asc') {
      result.reverse()
    }

    setFilteredPosts(result)
  }, [posts, searchQuery, selectedCategory, sortBy, sortOrder])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (value) => {
    // setSelectedCategory(value)
    if (value === "hello") {
      setSelectedCategory('')
    }
    else {
      setSelectedCategory(value)
    }
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const handleLayoutChange = (value) => {
    setLayout(value)
  }

  const subscribeToNewsletter = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    // Here you would typically send this to your API
    console.log(`Subscribing ${email} to newsletter`)
    toast.success('Subscribed to newsletter!')
    e.target.reset()
  }

  if (!mounted) return null

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
          <Link href={`/blog/${post._id}`}>
            <Button>Read More</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="bottom-right" />
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <header className="container mx-auto h-full py-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold mb-4">
              Welcome to Our Blog
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Stay up to date with the latest news, tutorials, and guides on web development, mobile development, AI, and more.
            </p>
          </header>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
              icon={<Search className="h-4 w-4 text-gray-400" />} />
          </div>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hello">All Categories</SelectItem> {/* Placeholder with empty value */}
              {Array.from(new Set(posts?.map(post => post.category))).map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Select onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-[200px] w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Masonry
              breakpointCols={{
                default: 3,
                1100: 2,
                700: 1
              }}
              className="flex w-auto"
              columnClassName="bg-clip-padding px-2">
              {filteredPosts.map(post => (
                <div key={post.id} className="mb-4">
                  <BlogPostCard post={post} />
                </div>
              ))}
            </Masonry>
          )}
        </AnimatePresence>
        <NewsLetterSignUP />
      </div>
    </div>)
  );
}