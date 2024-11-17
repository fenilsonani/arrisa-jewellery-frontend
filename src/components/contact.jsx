'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader2, Mail, Phone, MapPin, Clock, Globe } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  department: z.string().min(1, { message: "Please select a department." }),
  urgency: z.string().min(1, { message: "Please select an urgency level." }),
  newsletter: z.boolean().default(false).optional(),
})

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      department: "",
      urgency: "",
      newsletter: false,
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    toast.success("Message sent successfully!")
    console.log(values)
    form.reset()
  }

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    <FormField
                      control={form.control}
                      name="newsletter"
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Subscribe to newsletter
                            </FormLabel>
                            <FormDescription>
                              Receive updates about our products and services.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>You can also reach us using the following information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:glimmerwave.store@gmail.com"
                      className="text-sm text-muted-foreground hover:text-primary">glimmerwave.store@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a
                      href="tel:+1(917)306-6124"
                      className="text-sm text-muted-foreground hover:text-primary">+1(917)306-6124</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-muted-foreground">62 W 47th St, New York, NY 10036</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9AM - 5PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Globe className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Website</p>
                    <a
                      href="https://glimmerwave.store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary">
                      https://glimmerwave.store
                    </a>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1185.5853211730164!2d-73.98158833632955!3d40.75763023980187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ff0c765271%3A0x6fff224d57f278de!2s62%20W%2047th%20St%2C%20New%20York%2C%20NY%2010036!5e0!3m2!1sen!2sus!4v1727898184160!5m2!1sen!2sus"
                    allowFullScreen></iframe>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>)
  );
}