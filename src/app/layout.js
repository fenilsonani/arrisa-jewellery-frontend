import { Inter } from "next/font/google";
import "./globals.css";
import ScrollSmoother from "@/components/SmoothScrollComponent";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TopHeadbar from "@/components/top-header";
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from '@next/third-parties/google'
import { ReduxProvider } from "@/store/Provider";
import { ToastContainer } from "react-toastify";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Glimmerwave | Home",
  description: "Glimmerwave",
  keywords: "Glimmerwave",
  author: "Glimmerwave",
  viewport: "width=device-width, initial-scale=1.0",
  image: "/logo.png",
  url: "https://glimmerwave.store",
  type: "website",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glimmerwave",
    description: "Glimmerwave",
    image: "/logo.png",
    url: "https://glimmerwave.store",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://glimmerwave.store",
    siteName: "Glimmerwave",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Glimmerwave",
      },
    ],
    logo: {
      url: "/logo.png",
      alt: "Glimmerwave",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        <GoogleAnalytics gaId="G-SZSH16KVEK" />
        {/* <ScrollSmoother> */}
        <ReduxProvider>
          <TopHeadbar />
          <Navbar />
          <main className="min-h-screen">
            <ToastContainer position="bottom-right" />
            {children}
          </main>
          <Footer />
        </ReduxProvider>
        {/* </ScrollSmoother> */}
      </body>
    </html>
  );
}
