import { Inter } from "next/font/google";
import "./globals.css";
import ScrollSmoother from "@/components/SmoothScrollComponent";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TopHeadbar from "@/components/top-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Headers /> */}
        <Toaster
          position="top-right"
        />
        <main>
          <ScrollSmoother>
            <TopHeadbar />
            <Navbar />
            {children}
          </ScrollSmoother>
        </main>
      </body>
    </html>
  );
}
