import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Luxury Jewels</h2>
            <p className="text-gray-400">
              Discover the finest luxury jewelry collections, hand-crafted with
              precision and passion to enhance your elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Shop
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <p className="text-gray-400 mb-4">
              Stay connected with us through social platforms and be the first to
              know about our new collections and special offers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={24} />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white transition">
                <Pinterest size={24} />
              </a> */}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 Luxury Jewels. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


export default Footer;