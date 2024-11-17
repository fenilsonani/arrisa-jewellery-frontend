'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MessageCircle, CheckCircle, X } from 'lucide-react'
import axios from 'axios'
import { Skeleton } from "@/components/ui/skeleton"

// export async function generateMetadata() {
//     return {
//         title: 'Support Tickets | Glimmerwave',
//         description: 'View and manage your support tickets',
//         keywords: 'support, tickets, glimmerwave, jewelry, store',
//         openGraph: {
//             title: 'Support Tickets | Glimmerwave',
//             description: 'View and manage your support tickets',
//             type: 'website',
//             url: 'https://glimmerwave.store/support/tickets',
//             images: [
//                 'https://glimmerwave.store/default-blog-image.jpg',
//             ],
//         },
//         twitter: {
//             title: 'Support Tickets | Glimmerwave',
//             description: 'View and manage your support tickets',
//             images: [
//                 'https://glimmerwave.store/default-blog-image.jpg',
//             ],
//         },
//         icons: {
//             icon: '/favicon.ico',
//         },
//         category: 'jewelry',
//         robots: 'index, follow',
//         viewport: 'width=device-width, initial-scale=1.0',
//         referrer: 'origin-when-cross-origin',
//     }
// }

export default function SupportTicketManager() {
    const [tickets, setTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [newTicket, setNewTicket] = useState({ subject: '', message: '', contactEmail: '' })
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTickets().then((data) => {
            setTickets(data)
            setLoading(false)
        })
    }, [])

    const fetchTickets = async () => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.glimmerwave.store/api/v1/support/tickets',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        return await axios.request(config)
            .then((response) => {
                return response.data.tickets;
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const createTicket = async (ticket) => {
        setLoading(true)
        const axios = require('axios');
        let data = JSON.stringify({
            "subject": ticket?.subject,
            "message": ticket?.message,
            "contactEmail": ticket?.contactEmail
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.glimmerwave.store/api/v1/support/tickets',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                setLoading(false)
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });

    }

    const addResponse = async (ticketId, response) => {
        setLoading(true)
        /* // Simulated API call
        console.log('Adding response to ticket', ticketId, response)
        return { id: Date.now().toString(), message: response, respondedAt: new Date().toISOString() } */
        const axios = require('axios');
        let data = JSON.stringify({
            "message": response
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.glimmerwave.store/api/v1/support/admin/tickets/${ticketId}/responses`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: data
        };

        return await axios.request(config)
            .then((response) => {
                setLoading(false)
                return response.data.response
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });

    }

    const handleCreateTicket = async (e) => {
        e.preventDefault()
        const ticket = await createTicket(newTicket)
        setTickets([ticket, ...tickets])
        setNewTicket({ subject: '', message: '', contactEmail: '' })
        setSelectedTicket(ticket)
    }

    const handleAddResponse = async (e) => {
        e.preventDefault()
        if (selectedTicket) {
            const newResponse = await addResponse(selectedTicket.id, response)
            fetchTickets().then((data) => {
                setTickets(data)
                setSelectedTicket(data.find(t => t.id === selectedTicket.id))
                setResponse('')
            })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4 w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Support Ticket Manager</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton key={index} className="h-16 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-500'
            case 'In Progress': return 'bg-blue-500'
            case 'Closed': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="container mx-auto p-4 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Support Ticket Manager</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Your Tickets</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Ticket
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            {tickets?.map(ticket => (
                                <div key={ticket.id} className="mb-4">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left py-8"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className='py-8'>
                                                <div className="font-semibold">{ticket?.subject}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {ticket?.responses?.length > 0 ? `${ticket?.responses?.length} response(s)` : 'No responses yet'}
                                                </div>
                                            </div>
                                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    </Button>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    {selectedTicket ? (
                        <>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Ticket Details</CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{selectedTicket?.subject}</h3>
                                    <Badge className={`${getStatusColor(selectedTicket.status)} text-white mb-4`}>
                                        {selectedTicket.status}
                                    </Badge>
                                    <p className="mb-4">{selectedTicket.message}</p>
                                    <h4 className="font-semibold mb-2">Responses:</h4>
                                    <ScrollArea className="h-[300px] mb-4">
                                        {
                                            selectedTicket?.responses?.length === 0 && (
                                                <div className="text-muted-foreground text-center">No responses yet</div>
                                            )
                                        }
                                        {selectedTicket?.responses?.map(response => (
                                            <div key={response.id} className="mb-2">
                                                <p>{response.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(response.respondedAt).toLocaleString()}
                                                </p>
                                                <Separator className="my-2" />
                                            </div>
                                        ))}
                                    </ScrollArea>
                                    <form onSubmit={handleAddResponse} className="space-y-2">
                                        <Textarea
                                            value={response}
                                            onChange={(e) => setResponse(e.target.value)}
                                            placeholder="Add a response..."
                                        />
                                        <Button type="submit" className="w-full">
                                            <MessageCircle className="mr-2 h-4 w-4" /> Add Response
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader>
                                <CardTitle>Create New Ticket</CardTitle>
                                <CardDescription>Fill out the form below to submit a new support ticket.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateTicket} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={newTicket.subject}
                                            onChange={(e) => {
                                                setNewTicket({ ...newTicket, subject: e.target.value })
                                            }}
                                            placeholder="Brief description of your issue"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={newTicket.message}
                                            onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                            placeholder="Provide details about your issue or question"
                                            required
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="contactEmail">Contact Email</Label>
                                        <Input
                                            id="contactEmail"
                                            value={newTicket.contactEmail}
                                            onChange={(e) => setNewTicket({ ...newTicket, contactEmail: e.target.value })}
                                            placeholder="Your email address"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}
