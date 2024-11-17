import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

const NewsLetterSignUP = () => {

    const [email, setEmail] = React.useState('')

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubscribe = async (e) => {
        e.preventDefault()
        let data = JSON.stringify({
            "email": email
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.glimmerwave.store/api/v1/users/newsletter/subscribe',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                toast({
                    title : "Subscribed to Newsletter",
                    description : "You have successfully subscribed to our newsletter",
                })
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title : "Error",
                    description : error.message,
                    status : "destructive"
                })
            });
    }

    return (
        <div>
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
        </div>
    )
}

export default NewsLetterSignUP
