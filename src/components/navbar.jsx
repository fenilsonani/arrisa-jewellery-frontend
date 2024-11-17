"use client"

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import toast from "react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";

// Navigation items list
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Jewelry Products", href: "/products/jewelery/all" },
  { name: "GemStone Products", href: "/products/gemstone/all" },
  { name: "Support", href: "/support/general" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog/all" },
  { name: "Terms and Conditions", href: "/terms-and-condition" }
];

// NavLink Component for DRY
function NavLink({ href, children }) {
  return (
    <Link href={href} className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
      {children}
    </Link>
  );
}

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

export default function Navbar() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
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



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <header className="container mx-auto flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Sheet for mobile menu */}
      <div className="lg:hidden flex items-center justify-between w-full">

        {/* Logo in the middle for mobile */}
        <Link href="/" className="" prefetch={false}>
          <Image
            src="/header.svg"
            alt="Jewel Store"
            width={100}
            height={100}
            className="h-16 w-16"
          />
        </Link>

        {/* Cart and account button on the right for mobile */}
        <div className="flex items-center space-x-2">
          <Link href="/cart" prefetch={false}>
            <Button variant="outline" size="icon" className="text-sm">
              <CartIcon className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" className="text-sm">
                  <UserIcon className="h-6 w-6" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile" prefetch={false}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout" prefetch={false}>
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" prefetch={false}>
              <Button variant="outline" className="text-sm">
                Login / Signup
              </Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <ScrollArea className="h-full">
                <div className="flex flex-col justify-between px-4 py-2">
                  <div className="grid gap-2 py-6">
                    {navItems.map((item) => (
                      <NavLink key={item.name} href={item.href}>
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
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
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Navigation menu for larger screens */}
      <div className="hidden lg:flex justify-between w-full items-center">
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <Link href="/" className="mr-6" prefetch={false}>
            <Image
              src="/header.svg"
              alt="Jewel Store"
              width={100}
              height={100}
              className="h-20 w-20"
            />
          </Link>

          {/* Navigation links */}
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuLink asChild key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                    prefetch={false}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Cart and account buttons */}
        <div className="flex space-x-4">
          <Link href="/cart" prefetch={false}>
            <CartIcon className="h-6 w-6" />
            <span className="sr-only">Cart</span>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserIcon className="h-6 w-6" />
                <span className="sr-only">User menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile" prefetch={false}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/logout" prefetch={false}>
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" prefetch={false}>
              {/* <Button variant="outline" className="text-sm"> */}
              Login / Signup
              {/* </Button> */}
            </Link>
          )}
        </div>
      </div>
    </header >
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.29 18.29a2 2 0 0 0-2-2.59 8.5 8.5 0 0 0-12.58 0 2 2 0 0 0-2 2.59" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
