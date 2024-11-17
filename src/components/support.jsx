'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Phone, Mail, MessageSquare, FileText, HelpCircle } from 'lucide-react'
import Link from 'next/link';

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions sent to your email to create a new password."
  },
  {
    question: "Can I change my subscription plan?",
    answer: "Yes, you can change your subscription plan at any time. Go to your account settings and select 'Subscription'. From there, you can upgrade, downgrade, or cancel your plan."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team through email at support@example.com, by phone at +1 (234) 567-890, or by using the chat feature on our website."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for business accounts."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store."
  },
  {
    question: "How do I update my account information?",
    answer: "To update your account information, go to your account settings and select 'Profile'. From there, you can edit your name, email address, password, and other details."
  },
]

const supportTeam = [
  { name: "Alice Johnson", role: "Customer Support Lead", image: "/placeholder.svg?height=100&width=100" },
  { name: "Bob Smith", role: "Technical Support Specialist", image: "/placeholder.svg?height=100&width=100" },
  { name: "Carol Williams", role: "Account Manager", image: "/placeholder.svg?height=100&width=100" },
]

export function Support() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    (<div
      className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-bold text-center mb-8">Support Center</h1>
        </motion.div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="team">Our Team</TabsTrigger>
          </TabsList>
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    icon={<Search className="h-4 w-4 text-gray-400" />} />
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get in touch with our support team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-muted-foreground hover:text-primary">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <a
                      href="mailto:support@example.com"
                      className="text-sm text-muted-foreground hover:text-primary">support@example.com</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Support Ticket</p>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Open a new ticket</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Meet Our Support Team</CardTitle>
                <CardDescription>Our dedicated professionals are here to help you.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {supportTeam.map((member, index) => (
                    <div key={index} className="text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>We're here to assist you with any questions or concerns.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href={"/support/tickets/"}>
                <Button size="lg" className="mt-4">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Get Personalized Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>)
  );
}