import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from 'next/image'
import { motion } from 'framer-motion'
import ProductCard from './product-card'


const HomeProduct = ({ title, products }) => {

    if (!products) return null

    return (
        <div>
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-12">
                        {title} Products
                    </h2>
                    <Tabs defaultValue="All" className="mb-8">
                        <TabsList className="justify-center">
                            <TabsTrigger value="All">All</TabsTrigger>
                            {
                                [...new Set(products?.map(item => item.category))].map((item) => (
                                    <TabsTrigger key={item} value={item}>
                                        {item}
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        <TabsContent value="All">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products?.map((product) => (
                                    <ProductCard key={product.id} image={product?.image} name={product.name} price={product.price} stockQuantity={product.stockQuantity} rating={product.rating} _id={product._id} />
                                ))}
                            </div>
                        </TabsContent>
                        {
                            [...new Set(products?.map(item => item.category))]?.map((item) => (
                                <TabsContent key={item} value={item}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {products
                                            .filter((product) => product.category === item)
                                            .map((product) => (
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
                            ))
                        }
                    </Tabs>
                </div>
            </section>
        </div>
    )
}

export default HomeProduct
