'use client';
import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import readingTime from 'reading-time'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-hot-toast'
import 'react-toastify/dist/ReactToastify.css'
import { Facebook, Twitter, Linkedin, Clock, Calendar, User, MessageSquare, ThumbsUp, Share2, Bookmark, Eye, PlusIcon } from 'lucide-react'
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';

// Mock data for the blog post
// const blog = {
//   id: '1',
//   title: 'The Future of Web Development: Trends to Watch in 2023',
//   content: `
// # Introduction

// In the ever-evolving world of web development, staying ahead of the curve is crucial. As we move further into 2023, several exciting trends are shaping the future of how we build and interact with websites and web applications.

// ## 1. AI-Powered Development

// Artificial Intelligence is revolutionizing web development in numerous ways:

// - **Code Generation**: AI tools can now generate boilerplate code, reducing development time.
// - **Design Assistance**: AI-powered design tools help create more intuitive user interfaces.
// - **Predictive User Behavior**: AI algorithms can analyze user behavior to personalize web experiences.

// \`\`\`python
// # Example of AI-generated code
// def generate_greeting(name):
//     return f"Hello, {name}! Welcome to the future of web development."

// print(generate_greeting("Developer"))
// \`\`\`

// ## 2. WebAssembly (Wasm)

// WebAssembly is gaining traction, allowing developers to run high-performance applications in web browsers:

// - Enables running languages like C++ and Rust in the browser
// - Improves performance for complex web applications
// - Opens up new possibilities for web-based games and tools

// ## 3. Progressive Web Apps (PWAs)

// PWAs continue to bridge the gap between web and native applications:

// - Offline functionality
// - Push notifications
// - App-like interface and experience

// ## Conclusion

// The web development landscape is constantly changing, offering exciting opportunities for developers to create more powerful, efficient, and user-friendly web experiences. By staying informed about these trends, developers can position themselves at the forefront of innovation in the field.
//   `,
//   author: {
//     name: 'Jane Doe',
//     avatar: '/placeholder.svg?height=100&width=100',
//     bio: 'Jane is a senior web developer with over 10 years of experience in creating innovative web solutions.',
//     twitter: 'janedoe',
//     github: 'janedoe',
//     linkedin: 'janedoe'
//   },
//   publishedDate: '2023-05-15',
//   categories: ['Web Development', 'Technology Trends'],
//   tags: ['AI', 'WebAssembly', 'PWA'],
//   relatedPosts: [
//     { id: '2', title: 'Mastering React Hooks', excerpt: 'Learn how to use React Hooks effectively in your projects.' },
//     { id: '3', title: 'The Rise of Jamstack', excerpt: 'Explore the benefits of Jamstack architecture for modern web development.' },
//     { id: '4', title: 'GraphQL vs REST: A Comparison', excerpt: 'Understand the pros and cons of GraphQL and REST APIs.' }
//   ]
// }



const TableOfContents = ({ content }) => {
  const headings = content.match(/^#{1,6}.+$/gm) || []

  const scrollToHeading = (heading) => {
    const target = document.querySelector(`#${heading.replace(/ /g, '-').toLowerCase()}`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      console.log('target not found')
    }
  }

  return (
    (<Card className="mb-6">
      <CardHeader>
        <CardTitle>Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <>
              <Link
                key={index}
                href={`#${heading.replace(/ /g, '-').toLowerCase()}`}
                className="cursor-pointer hover:text-primary">
                {heading.replace(/^#+\s/, '')}
              </Link>
              <Separator />
            </>
          ))}
        </ul>
      </CardContent>
    </Card>)
  );
}


export function BlogDetails({ data }) {
  const [isLoading, setIsLoading] = useState(true)
  const [blogPost, setBlogPost] = useState(null)
  const [commentText, setCommentText] = useState()
  // const router = useRouter()
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const fetchData = async () => {
    let config = {
      method: 'get',
      url: 'http://localhost:3005/api/v1/blog/' + data,
    };

    await axios.request(config)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false)
        setBlogPost(response.data.post)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const estimatedReadingTime = readingTime(blogPost?.content).text

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar>
                  <AvatarImage src={"FS"} alt={"Fenil Sonani"} />
                  <AvatarFallback>{"FS"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{blogPost.author.username}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4 text-primary" />
                    {
                      new Date(blogPost.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    }
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Clock className="mr-1 h-4 w-4" />
                    {readingTime(blogPost?.content)?.text}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {blogPost?.categories?.map(category => (
                  <Badge key={category} variant="secondary">{category}</Badge>
                ))}
              </div>
              <img
                src={blogPost.featuredImage}
                alt="Blog post cover"
                width={800}
                height={400}
                className="rounded-lg mb-8 w-full" />
              <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon"
                    onClick={() => {
                      // facebook share url
                      const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')
                    }}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon"
                    onClick={() => {
                      // twitter share url
                      window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blogPost.title}`, '_blank')
                    }}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    // linkdin share url
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')
                  }}>
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    // share popup of navigator
                    navigator.share({
                      title: blogPost.title,
                      text: blogPost.excerpt,
                      url: shareUrl
                    })
                  }}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <div className="sticky top-4">
                    <TableOfContents content={blogPost?.content} />
                  </div>
                </div>
                <div className="md:col-span-3 prose md:prose-lg lg:prose-xl" ref={ref}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}>
                    {blogPost?.content}
                  </ReactMarkdown>
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blogPost.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-8" />
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Comments</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/avatar.svg" alt="John Doe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                          <Button variant="outline" size="sm"
                            onClick={async () => {
                              toast.success("ID" + data)
                              let datas = {
                                "comment": commentText
                              }

                              let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `http://localhost:3005/api/v1/blog/${data}/comments`,
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                data: datas
                              };

                              await axios.request(config)
                                .then((response) => {
                                  console.log(JSON.stringify(response.data));
                                  toast.success('Comment posted successfully')
                                  fetchData()
                                })
                                .catch((error) => {
                                  console.log(error);
                                  toast.error('Failed to post comment' + error)
                                });

                            }}
                          >
                            Post Comment <PlusIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {/* comment from other users */}
                      {blogPost.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-1 border-b border-muted-foreground pb-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{comment.commenter.username}</p>
                              <p className="text-muted-foreground">
                                {
                                  new Date(comment.commentedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                }
                              </p>
                            </div>
                            <p className="text-muted-foreground">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <div>
                    <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {blogPost?.relatedPosts?.map(post => (
                        <Card
                          key={post.id}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            // router.push(`/blog/${post.id}`)
                          }}>
                          <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{post.excerpt}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>)
  );
}