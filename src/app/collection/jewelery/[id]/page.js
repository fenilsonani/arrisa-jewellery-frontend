"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";

export default function CollectionProducts() {
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    priceRange: [0, 10000],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  const fetchCollectionData = async () => {
    setLoading(true);
    try {
      const params = {
        collectionId: id,
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        priceMin: filters.priceRange[0],
        priceMax: filters.priceRange[1],
        sort: sortOption !== "default" ? sortOption : undefined,
      };

      const response = await axios.get(`/api/v1/products/collection/${id}`, {
        params,
      });

      setProducts(response.data.products);
      setPagination({
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCollectionData();
    }
  }, [id, pagination.page, pagination.limit, filters, sortOption]);

  const handleSortChange = (value) => {
    setSortOption(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageSizeChange = (value) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(value), page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      priceRange: [0, 10000],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSortOption("default");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-64 mb-4" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Jewelry Collection</h1>
        <div className="flex items-center space-x-4">
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
              <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
              <SelectItem value="ratingHighLow">Rating: High to Low</SelectItem>
              <SelectItem value="nameAZ">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={
                product.images[0] || "https://picsum.photos/300/200?random=100"
              }
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-lg font-bold mb-2">
                ${(product.price || 0).toFixed(2)}
              </p>
              <Link href={`/products/jewelry/${product._id}`} passHref>
                <Button className="w-full mt-4">View Details</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {pagination.page} of {pagination.pages}
        </span>
        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, pagination.pages),
            }))
          }
          disabled={pagination.page >= pagination.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
