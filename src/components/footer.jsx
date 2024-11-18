import { X } from 'lucide-react';
import { TwitterIcon } from 'lucide-react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { FaPinterest } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-10">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Logo and Description */}
//           <div>
//             <h2 className="text-2xl font-bold mb-4">GlimmerWave</h2>
//             <p className="text-gray-400">
//               Discover the finest luxury jewelry collections, hand-crafted with
//               precision and passion to enhance your elegance.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
//             <ul>
//               <li className="mb-2">
//                 {/* <a href="#" className="text-gray-400 hover:text-white transition">
//                   About Us
//                 </a> */}
//                 <Link href="/about" className="text-gray-400 hover:text-white transition">
//                   About Us
//                 </Link>
//               </li>
//               <li className="mb-2">
//                 {/* <a href="#" className="text-gray-400 hover:text-white transition">
//                   Shop
//                 </a> */}
//                 <Link href="/products" className="text-gray-400 hover:text-white transition">
//                   Shop
//                 </Link>
//               </li>
//               <li className="mb-2">
//                 {/* <a href="#" className="text-gray-400 hover:text-white transition"> */}
//                 {/* Contact Us */}
//                 {/* </a> */}
//                 <Link href="/contact" className="text-gray-400 hover:text-white transition">
//                   Contact Us
//                 </Link>
//               </li>
//               <li className="mb-2">
//                 {/* <a href="#" className="text-gray-400 hover:text-white transition">
//                   Privacy Policy
//                 </a> */}
//                 <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li className="mb-2">
//                 {/* <a href="#" className="text-gray-400 hover:text-white transition">
//                   Terms of Service
//                 </a> */}
//                 <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition">
//                   Terms of Service
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Social Media Links */}
//           <div>
//             <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
//             <p className="text-gray-400 mb-4">
//               Stay connected with us through social platforms and be the first to
//               know about our new collections and special offers.
//             </p>
//             <div className="flex space-x-4">
//               <Link href="https://www.facebook.com/glimmerwave.store" className="text-gray-400 hover:text-white transition">
//                 <Facebook size={24} />
//               </Link>
//               <Link href="https://www.instagram.com/glimmer.wave/" className="text-gray-400 hover:text-white transition">
//                 <Instagram size={24} />
//               </Link>
//               <Link href="https://x.com/glimmer_wave" className="text-gray-400 hover:text-white transition">
//                 <X size={24} />
//               </Link>
//               {/* <a href="#" className="text-gray-400 hover:text-white transition">
//                 <Pinterest size={24} />
//               </a> */}
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 border-t border-gray-700 pt-6 text-center">
//           <p className="text-gray-500 text-sm">
//             &copy; 2024 GlimmerWave. All Rights Reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


// export default Footer;

const FooterLink = ({ href, children }) => {
  return (
    <Link href={href} className="text-gray-400 hover:text-white transition text-lg">
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-10 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between border-b-2 border-gray-200 pb-8">
          <img src="/logo.jpeg" alt="Company Logo" className="mb-4 h-24 rounded-2xl" />
          <p className="text-gray-400 w-1/2">
            Discover the finest luxury jewelry collections, hand-crafted with precision and passion to enhance your elegance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 pt-10">
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">Customer Service</h3>
            <ul>
              <li>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
              </li>
              <li>
                <FooterLink href="/refund-policy">Refund Policy</FooterLink>
              </li>
            </ul>
          </div>
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">Shop</h3>
            <ul>
              <li>
                <FooterLink href="/products">All Products</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/jewelery/all">Jewelery</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/gemstone/all">Gemstone</FooterLink>
              </li>
              <li>
                <FooterLink href="/suppliers">Suppliers</FooterLink>
              </li>
            </ul>
          </div>
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">Shop</h3>
            <ul>
              <li>
                <FooterLink href="/products">All Products</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/jewelery/all">Jewelery</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/gemstone/all">Gemstone</FooterLink>
              </li>
              <li>
                <FooterLink href="/suppliers">Suppliers</FooterLink>
              </li>
            </ul>
          </div>
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">Shop</h3>
            <ul>
              <li>
                <FooterLink href="/products">All Products</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/jewelery/all">Jewelery</FooterLink>
              </li>
              <li>
                <FooterLink href="/products/gemstone/all">Gemstone</FooterLink>
              </li>
              <li>
                <FooterLink href="/suppliers">Suppliers</FooterLink>
              </li>
            </ul>
          </div>
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">About Us</h3>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Our Story</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sustainability</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
            </ul>
          </div>
          <div className="pb-4">
            <h3 className="mb-3 font-semibold text-white text-xl     border-t-[1px] md:border-0 border-gray-400 pt-3">Follow Us</h3>
            <div className="flex space-x-4">
              {/* <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white">
                <img src="path/to/facebook-icon.png" alt="Facebook" className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
                <img src="path/to/instagram-icon.png" alt="Instagram" className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">
                <img src="path/to/twitter-icon.png" alt="Twitter" className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Pinterest" className="text-gray-400 hover:text-white">
                <img src="path/to/pinterest-icon.png" alt="Pinterest" className="h-6 w-6" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white">
                <img src="path/to/youtube-icon.png" alt="YouTube" className="h-6 w-6" />
              </a> */}
              <Link href="https://www.facebook.com/glimmerwave.store" className="text-gray-400 hover:text-white transition">
                <Facebook size={24} />
              </Link>
              <Link href="https://www.instagram.com/glimmer.wave/" className="text-gray-400 hover:text-white transition">
                <Instagram size={24} />
              </Link>
              <Link href="https://x.com/glimmer_wave" className="text-gray-400 hover:text-white transition">
                <TwitterIcon size={24} />
              </Link>
              <Link href={"https://pinterest.com"} className="text-gray-400 hover:text-white transition">
                <FaPinterest size={24} />
              </Link>
              {/* <a href="#" className="text-gray-400 hover:text-white">
                <Pinterest size={24} />
              </a> */}
            </div>
          </div>
        </div>
        {/* Horizontal Divider */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2023 Your E-commerce Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;