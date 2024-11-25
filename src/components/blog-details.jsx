'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import readingTime from 'reading-time'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Facebook, Twitter, Linkedin, Clock, Calendar, Share2, Bookmark } from 'lucide-react'
import axios from 'axios'

export function BlogDetails({ data }) {
  const [isLoading, setIsLoading] = useState(true)
  const [blogPost, setBlogPost] = useState(null)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/v1/blog/${data}`)
        setIsLoading(false)
        setBlogPost(response.data.post)
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [data])

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence>
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}>
              <motion.h1 
                className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {blogPost.title}
              </motion.h1>
              <motion.div 
                className="flex items-center space-x-4 mb-6 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(blogPost.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {readingTime(blogPost?.content)?.text}
                </div>
              </motion.div>
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {blogPost?.categories?.map((category, index) => (
                  <Badge 
                    key={category} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                  >
                    {category}
                  </Badge>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={blogPost.featuredImage}
                  alt="Blog post cover"
                  width={800}
                  height={400}
                  className="rounded-lg mb-8 w-full object-cover shadow-lg"
                />
              </motion.div>
              <motion.div 
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex space-x-2">
                  {['facebook', 'twitter', 'linkedin'].map((platform) => (
                    <Button key={platform} variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                      {platform === 'facebook' && <Facebook className="h-5 w-5" />}
                      {platform === 'twitter' && <Twitter className="h-5 w-5" />}
                      {platform === 'linkedin' && <Linkedin className="h-5 w-5" />}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
              <motion.div 
                className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none" 
                ref={ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter 
                          style={tomorrow} 
                          language={match[1]} 
                          PreTag="div" 
                          {...props}
                          className="rounded-md shadow-md"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                    p: ({ children }) => (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="leading-relaxed"
                      >
                        {children}
                      </motion.p>
                    ),
                    h1: ({ children }) => (
                      <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold mt-8 mb-4 text-primary"
                      >
                        {children}
                      </motion.h1>
                    ),
                    h2: ({ children }) => (
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-semibold mt-6 mb-3 text-primary/80"
                      >
                        {children}
                      </motion.h2>
                    ),
                  }}>
                  {blogPost?.content}
                </ReactMarkdown>
                <motion.div 
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-primary">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors duration-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

