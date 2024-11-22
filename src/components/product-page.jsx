// app/products/jewelry/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";

export default function JewelryProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    priceRange: [0, 10000],
    minRating: 0,
    categories: [],
    brands: [],
    materials: [],
    gemstoneTypes: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    materials: [],
    gemstoneTypes: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [sortOption, setSortOption] = useState("default");

  const pageSizeOptions = [10, 20, 50, 100];

  // Function to parse query parameters into filter state
  const parseQueryParams = () => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const minRating = searchParams.get("minRating");
    const categories = searchParams.get("categories");
    const brands = searchParams.get("brands");
    const materials = searchParams.get("materials");
    const gemstoneTypes = searchParams.get("gemstoneTypes");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const sort = searchParams.get("sort");

    setFilters({
      search: search || "",
      priceRange: [
        priceMin ? Number(priceMin) : 0,
        priceMax ? Number(priceMax) : 10000,
      ],
      minRating: minRating ? Number(minRating) : 0,
      categories: categories ? categories.split(",") : [],
      brands: brands ? brands.split(",") : [],
      materials: materials ? materials.split(",") : [],
      gemstoneTypes: gemstoneTypes ? gemstoneTypes.split(",") : [],
    });

    setPagination((prev) => ({
      ...prev,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    }));

    setSortOption(sort || "default");
  };

  // Update URL query parameters without reloading the page
  const updateURL = () => {
    const params = new URLSearchParams();

    if (pagination.page !== 1) params.set("page", pagination.page.toString());
    if (pagination.limit !== 20)
      params.set("limit", pagination.limit.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.minRating > 0)
      params.set("minRating", filters.minRating.toString());
    if (filters.categories.length > 0)
      params.set("categories", filters.categories.join(","));
    if (filters.brands.length > 0)
      params.set("brands", filters.brands.join(","));
    if (filters.materials.length > 0)
      params.set("materials", filters.materials.join(","));
    if (filters.gemstoneTypes.length > 0)
      params.set("gemstoneTypes", filters.gemstoneTypes.join(","));
    if (filters.priceRange[0] > 0)
      params.set("priceMin", filters.priceRange[0].toString());
    if (filters.priceRange[1] < 10000)
      params.set("priceMax", filters.priceRange[1].toString());
    if (sortOption !== "default") params.set("sort", sortOption);

    const newUrl = `${pathname}?${params.toString()}`;

    router.replace(newUrl);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        categories:
          filters.categories.length > 0
            ? filters.categories.join(",")
            : undefined,
        brands:
          filters.brands.length > 0 ? filters.brands.join(",") : undefined,
        materials:
          filters.materials.length > 0
            ? filters.materials.join(",")
            : undefined,
        gemstoneTypes:
          filters.gemstoneTypes.length > 0
            ? filters.gemstoneTypes.join(",")
            : undefined,
        priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        priceMax:
          filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
        sort: sortOption !== "default" ? sortOption : undefined,
      };

      const response = await axios.get(
        "http://localhost:3005/api/v1/products",
        { params }
      );
      const col = await axios.get(
        "http://localhost:3005/api/v1/collections",
        { params }
      );
      console.log("col: 336", col, "\nparams 336", params);
      console.log("Response: 336", response, "\nparams 336", params);

      setProducts(response.data.products);
      setFilterOptions({
        categories: response.data.filterOptions.categories,
        brands: response.data.filterOptions.brands,
        materials: response.data.filterOptions.materials,
        gemstoneTypes: response.data.filterOptions.gemstoneTypes,
      });
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Parse query parameters on initial load and when URL changes
  useEffect(() => {
    parseQueryParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch products whenever filters, pagination, or sortOption change
  useEffect(() => {
    fetchProducts();
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters, sortOption]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const isChecked = prev[key].includes(value);
      const updatedValues = isChecked
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];
      return { ...prev, [key]: updatedValues };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

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
      minRating: 0,
      categories: [],
      brands: [],
      materials: [],
      gemstoneTypes: [],
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSortOption("default");
    setIsFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        {/* Skeleton loaders */}
        <Skeleton className="h-10 w-64 mb-4 sm:mb-0" />
        {/* Add additional skeleton components as needed */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            Luxury Jewelry Collection
          </h1>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2 flex-grow sm:flex-grow-0">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="priceLowHigh">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="priceHighLow">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="ratingHighLow">
                    Rating: High to Low
                  </SelectItem>
                  <SelectItem value="nameAZ">Name: A-Z</SelectItem>
                  <SelectItem value="nameZA">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="button flex items-center space-x-2"
                aria-label="Open filter options panel"
                aria-expanded={isFilterOpen}
                tabIndex={0}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </SheetTrigger>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {pagination.total} products
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Items per page:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
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
                    product.images[0] ||
                    "https://picsum.photos/300/200?random=100"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.type}</p>
                  <p className="text-lg font-bold mb-2">
                    ${(product.price || 0).toFixed(2)}
                  </p>
                  {product.gemstones && product.gemstones.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold">Gemstones:</p>
                      <ul className="list-disc list-inside">
                        {product.gemstones.map((gem, index) => (
                          <li key={index}>
                            {gem.gemstoneId.name} - {gem.carat} ct
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.materials && product.materials.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold">Materials:</p>
                      <ul className="list-disc list-inside">
                        {product.materials.map((mat, index) => (
                          <li key={index}>
                            {mat.materialId.name} - {mat.weight}{" "}
                            {mat.weightUnit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.916c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.049 9.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.519-4.674z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.averageRating?.toFixed(1) || "N/A"})
                    </span>
                  </div>
                  <Link href={`/products/jewelery/${product._id}`} passHref>
                    <Button className="w-full mt-4">View Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8 items-center space-x-4">
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
        <SheetContent className="w-[calc(100%-2rem)]">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className=""
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-6rem)] pr-4 overflow-auto">
              <Accordion
                type="multiple"
                defaultValue={[
                  "search",
                  "price",
                  "rating",
                  "category",
                  "brand",
                  "material",
                  "gemstoneTypes",
                ]}
                className="w-full"
              >
                {/* Search Filter */}
                <AccordionItem value="search">
                  <AccordionTrigger>Search</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="pl-8"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Price Range Filter */}
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        handleFilterChange("priceRange", value)
                      }
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Minimum Rating Filter */}
                <AccordionItem value="rating">
                  <AccordionTrigger>Minimum Rating</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={filters.minRating.toString()}
                      onValueChange={(value) =>
                        handleFilterChange("minRating", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating === 0
                              ? "Any"
                              : `${rating} star${
                                  rating > 1 ? "s" : ""
                                } and above`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                {/* Category Filter */}
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {filterOptions.categories.map((category) => (
                        <Label
                          key={category}
                          className="flex items-center gap-2 font-normal"
                        >
                          <Checkbox
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() =>
                              handleCheckboxChange("categories", category)
                            }
                          />
                          {category}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Brand Filter */}
                <AccordionItem value="brand">
                  <AccordionTrigger>Brand</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {filterOptions.brands.map((brand) => (
                        <Label
                          key={brand}
                          className="flex items-center gap-2 font-normal"
                        >
                          <Checkbox
                            checked={filters.brands.includes(brand)}
                            onCheckedChange={() =>
                              handleCheckboxChange("brands", brand)
                            }
                          />
                          {brand}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Material Filter */}
                <AccordionItem value="material">
                  <AccordionTrigger>Materials</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {filterOptions.materials.map((material) => (
                        <Label
                          key={material}
                          className="flex items-center gap-2 font-normal"
                        >
                          <Checkbox
                            checked={filters.materials.includes(material)}
                            onCheckedChange={() =>
                              handleCheckboxChange("materials", material)
                            }
                          />
                          {material}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Gemstone Types Filter */}
                <AccordionItem value="gemstoneTypes">
                  <AccordionTrigger>Gemstone Types</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      {filterOptions.gemstoneTypes.map((gemType) => (
                        <Label
                          key={gemType}
                          className="flex items-center gap-2 font-normal"
                        >
                          <Checkbox
                            checked={filters.gemstoneTypes.includes(gemType)}
                            onCheckedChange={() =>
                              handleCheckboxChange("gemstoneTypes", gemType)
                            }
                          />
                          {gemType}
                        </Label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-4 flex justify-end">
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
