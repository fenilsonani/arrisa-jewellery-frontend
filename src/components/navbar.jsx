"use client"

import { Sheet, SheetTrigger, SheetHeader, SheetFooter, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import toast from "react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import { sendGAEvent } from "@next/third-parties/google";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Plus, Minus, X } from "lucide-react";


// Navigation items list
const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Jewelry Products", href: "/products/jewelery/all" },
  { name: "GemStone Products", href: "/products/gemstone/all" },
  // { name: "Support", href: "/support/general" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog/all" },
  // { name: "Terms and Conditions", href: "/terms-and-condition" }
];

// NavLink Component for DRY
function NavLink({ href, children }) {
  return (
    <Link href={href} className="flex w-full items-center py-2 text-lg font-semibold" prefetch={true}>
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
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState([]);

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

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'T-Shirt', price: 19.99, quantity: 1 },
    { id: 2, name: 'Jeans', price: 49.99, quantity: 1 },
    { id: 3, name: 'Sneakers', price: 79.99, quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    console.log('Applying coupon:', couponCode);
    setCouponCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;




  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', checkAuth);
    checkAuth(); // Check on mount

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const apiURL = process.env.NEXT_PUBLIC_API_URL + "/home/navbar-data";
      await fetch(apiURL).then((res) => res.json()).then((data) => {
        setCollections(data.collections);
      }).catch((err) => {
        console.error("Error fetching collections: ", err);
      });
    }
    fetchCollections();
  }, []);

  return (
    <header className="container mx-auto flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6 border-b-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>

        {/* Sheet for mobile menu */}
        <div className="lg:hidden flex items-center justify-between w-full">

          {/* Logo in the middle for mobile */}
          <Link href="/" className="" prefetch={true}>
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
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <CartIcon className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>

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
                    <Link href="/profile" prefetch={true}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout" prefetch={true}>
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" prefetch={true}>
                <Button variant="outline" className="text-sm"
                  onClick={
                    () => {
                      sendGAEvent({
                        action: "click",
                        category: "auth",
                        label: "login/signup clicked on mobile"
                      });
                    }
                  }
                >
                  Login / Signup
                </Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon"
                  onClick={
                    () => {
                      sendGAEvent({
                        action: "click",
                        category: "menu",
                        label: "menu icon clicked on mobile"
                      });
                    }
                  }
                >
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
            <Link href="/" className="mr-6" prefetch={true}>
              <Image
                src="/header.svg"
                alt="Jewel Store"
                width={100}
                height={100}
                className="h-20 w-20"
              />
            </Link>

            {/* Navigation links */}
            {/*   <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuLink asChild key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                      prefetch={true}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuList>
            </NavigationMenu> */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-full gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <li>
                        <Link href="/products/jewelery/all" prefetch={true} className="">
                          Jewelry Products
                        </Link>
                      </li>
                      <li>
                        <Link href="/products/gemstone/all" prefetch={true} className="">
                          GemStone Products
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Collection</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <span className="col-span-1 flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Collections</h3>
                        {
                          collections.map((collection) => (
                            <li>
                              <Link href={`/collection/${collection.slug}`} prefetch={true} className="hover:underline">
                                {collection.name}
                              </Link>
                            </li>
                          ))
                        }
                      </span>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/blog/all" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Cart and account buttons */}
          <div className="flex space-x-4">
            <Link href="/cart" prefetch={true}>
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
                    <Link href="/profile" prefetch={true}
                      onClick={
                        () => {
                          sendGAEvent({
                            action: "click",
                            category: "profile",
                            label: "profile clicked"
                          });
                        }
                      }
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout" prefetch={true}
                      onClick={
                        () => {
                          sendGAEvent({
                            action: "click",
                            category: "auth",
                            label: "logout clicked"
                          });
                        }
                      }
                    >
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" prefetch={true}>
                {/* <Button variant="outline" className="text-sm"> */}
                Login / Signup
                {/* </Button> */}
              </Link>
            )}
          </div>
        </div>

        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-auto py-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded bg-muted" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={applyCoupon}>Apply</Button>
            </div>
            <Button className="w-full">Checkout</Button>
          </div>
        </SheetContent>
      </Sheet>
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
