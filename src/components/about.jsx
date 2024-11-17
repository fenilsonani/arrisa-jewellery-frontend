'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from 'next-themes';
import {
  Sun, Moon, Briefcase, Clock, Users, History, Award, Phone, Mail, MapPin, Globe, Star, ShieldCheck, Lightbulb, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  { name: 'John Doe', role: 'CEO', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Jane Smith', role: 'CTO', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Mike Johnson', role: 'CFO', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Emily Brown', role: 'COO', image: '/placeholder.svg?height=100&width=100' },
];

const milestones = [
  { year: 2010, event: 'Company founded' },
  { year: 2015, event: 'Expanded to international markets' },
  { year: 2020, event: 'Launched innovative product line' },
  { year: 2023, event: 'Reached 1 million customers' },
];

const values = [
  { title: 'Innovation', description: 'Continuously innovating to bring cutting-edge solutions.', icon: <Lightbulb className="h-6 w-6 text-primary mr-2" /> },
  { title: 'Integrity', description: 'Upholding the highest standards of integrity in our actions.', icon: <ShieldCheck className="h-6 w-6 text-primary mr-2" /> },
  { title: 'Customer Focus', description: 'Putting customers at the heart of everything we do.', icon: <Star className="h-6 w-6 text-primary mr-2" /> },
  { title: 'Excellence', description: 'Striving for excellence in every aspect of our business.', icon: <TrendingUp className="h-6 w-6 text-primary mr-2" /> },
];

const testimonials = [
  { name: 'Alice Walker', feedback: 'An amazing company with top-notch products. Highly recommend!', image: '/placeholder.svg?height=100&width=100' },
  { name: 'Tom Hanks', feedback: 'Exceptional service and commitment to quality. A true leader in the industry.', image: '/placeholder.svg?height=100&width=100' },
];

export function About() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="h-full bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header Section */}
      <header className="container mx-auto h-full py-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold mb-4">About Us</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Innovating for a better tomorrow with a commitment to excellence, integrity, and customer satisfaction.
        </p>
      </header>

      {/* Mission Section */}
      <section className="container mx-auto pt-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <Briefcase className="mr-4 text-primary" /> Our Mission
        </h2>
        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              We strive to provide innovative solutions that improve people's lives and contribute to a sustainable future. Our commitment to excellence drives us to push boundaries and create meaningful impact in everything we do.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Values Section */}
      <section className="container mx-auto pt-16 rounded-2xl">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <Award className="mr-4 text-primary" /> Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border border-gray-200">
              <CardContent className="p-6 flex items-start">
                {value.icon}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-base">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <Users className="mr-4 text-primary" /> Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center p-4 border border-gray-200 hover:shadow-lg transition-shadow">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={member.image} alt={`${member.name} profile`} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <Badge variant="secondary" className="mt-2">{member.role}</Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="container mx-auto rounded-2xl">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <History className="mr-4 text-primary" /> Our Journey
        </h2>
        <div className="space-y-8 bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow rounded-2xl shadow-md">
          {milestones.map((milestone, index) => (
            <article key={index} className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                {milestone.year}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold">{milestone.event}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto pt-16">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <Users className="mr-4 text-primary" /> Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={testimonial.image} alt={`${testimonial.name} profile`} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                </div>
              </div>
              <p className="text-base">{testimonial.feedback}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto py-16 rounded-2xl">
        <h2 className="text-4xl font-bold mb-8 flex items-center">
          <Phone className="mr-4 text-primary" /> Contact Us
        </h2>
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className='bg-gray-50 p-6 rounded-2xl border border-gray-200"'>
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <MapPin className="mr-2 text-primary" /> Address
                </h3>
                <p>1234 Luxury Lane, City, Country</p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1185.5853211730164!2d-73.98158833632955!3d40.75763023980187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ff0c765271%3A0x6fff224d57f278de!2s62%20W%2047th%20St%2C%20New%20York%2C%20NY%2010036!5e0!3m2!1sen!2sus!4v1727898184160!5m2!1sen!2sus"
                  referrerpolicy="no-referrer-when-downgrade"
                  className='w-full h-96 mt-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow'
                ></iframe>
              </div>
              <div
                className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-1 flex items-center">
                  <Globe className="mr-2 text-primary" /> Get in Touch
                </h3>
                <div className='flex flex-col space-y-4'>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a
                        href="mailto:contact@example.com"
                        className="text-sm text-muted-foreground hover:text-primary">contact@example.com</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a
                        href="tel:+1234567890"
                        className="text-sm text-muted-foreground hover:text-primary">+1 (234) 567-890</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-muted-foreground">123 Business St, Tech City, 12345</p>
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
                      <Link
                        href="https://glimmerwave.store/support"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary">
                        glimmerwave.store/support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
