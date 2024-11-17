"use client";

import { useState } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

// Mock data for country and currency combinations
const countryCurrencyMap = {
    "United States": "USD",
    "India": "INR",
    "Germany": "EUR",
    "France": "EUR",
    "United Kingdom": "GBP"
};

// Get unique currencies from the countryCurrencyMap
const uniqueCurrencies = [...new Set(Object.values(countryCurrencyMap))];

export default function TopHeadbar() {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [selectedCountry, setSelectedCountry] = useState("United States");

    const handleCountryChange = (country) => {
        const linkedCurrency = countryCurrencyMap[country];
        if (linkedCurrency !== selectedCurrency) {
            setSelectedCountry(country);
            setSelectedCurrency(linkedCurrency);
        } else {
            setSelectedCountry(country);
        }
    };

    const handleCurrencyChange = (currency) => {
        const linkedCountry = Object.keys(countryCurrencyMap).find(country => countryCurrencyMap[country] === currency);
        if (linkedCountry !== selectedCountry) {
            setSelectedCurrency(currency);
            setSelectedCountry(linkedCountry);
        } else {
            setSelectedCurrency(currency);
        }
    };

    return (
        <div className="hidden md:visible">
            {/* Top Headbar with Container */}
            <div className="w-full bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Left Section: Currency and Country Selector */}
                    <div className="flex items-center space-x-2">
                        {/* Currency Selector */}
                        <div className="flex items-center space-x-1">
                            <span>Currency:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-sm font-medium">
                                    {selectedCurrency}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {uniqueCurrencies.map((currency) => (
                                        <DropdownMenuItem key={currency} onClick={() => handleCurrencyChange(currency)}>
                                            {currency}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <span className="text-gray-500 dark:text-gray-400">|</span>

                        {/* Country Selector */}
                        <div className="flex items-center space-x-1">
                            <span>Country:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-sm font-medium">
                                    {selectedCountry}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {Object.keys(countryCurrencyMap).map((country) => (
                                        <DropdownMenuItem key={country} onClick={() => handleCountryChange(country)}>
                                            {country}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Middle Section: Announcement */}
                    <div className="hidden sm:flex flex-grow justify-center text-sm font-medium">
                        <span>Free Shipping on Orders Above $500!</span>
                    </div>

                    {/* Right Section: Account and Wishlist Links */}
                    <div className="flex items-center space-x-2">
                        <Link href="/profile" prefetch={false} className="text-sm font-medium hover:underline">
                            Profile
                        </Link>
                        <span className="text-gray-500 dark:text-gray-400">|</span>
                        <Link href="/wishlist" prefetch={false} className="text-sm font-medium hover:underline">
                            Wishlist
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}