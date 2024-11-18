// components/SuppliersList.js

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge"; // Adjust the import based on your project structure

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        }
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export default function SuppliersList() {
    const [suppliers, setSuppliers] = useState(); // Using mock data
    const fetchSuppliers = async () => {
        const axios = require('axios');

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3005/api/v1/suppliers/',
            headers: {}
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setSuppliers(response.data.suppliers);
            })
            .catch((error) => {
                console.log(error);
            });

    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <motion.div
            className="container mx-auto px-4 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2
                className="text-3xl font-extrabold text-gray-800 mb-8"
                variants={itemVariants}
            >
                Our Esteemed Suppliers
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suppliers?.map((supplier) => (
                    <motion.div
                        key={supplier._id}
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{supplier.name}</h3>
                        <p className="text-gray-600 mb-1"><strong>Email:</strong> <a href={`mailto:${supplier.contactEmail}`} className="text-blue-500 hover:underline">{supplier.contactEmail}</a></p>
                        <p className="text-gray-600 mb-1"><strong>Phone:</strong> <a href={`tel:${supplier.contactPhone}`} className="text-blue-500 hover:underline">{supplier.contactPhone}</a></p>
                        <p className="text-gray-600 mb-4"><strong>Address:</strong>
                            {supplier.address.street}, {supplier.address.city}, {supplier.address.state}, {supplier.address.country}
                        </p>
                        <Badge variant="success" className="px-3 py-1 text-sm">Verified Supplier</Badge>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
