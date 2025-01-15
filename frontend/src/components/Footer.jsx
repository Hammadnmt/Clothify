import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4 text-pink-600">
              <Link to={"/"}>Clothify</Link>
            </h4>
            <p className="text-sm">
              Your one-stop shop for the latest in fashion and trends. Quality
              clothing at affordable prices.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gray-400">
                  Shop
                </Link>
              </li>
              {/* <li>
                <Link to="/categories" className="hover:text-gray-400">
                  Categories
                </Link>
              </li> */}
              {/* <li>
                <Link to="/deals" className="hover:text-gray-400">
                  Deals
                </Link>
              </li> */}
              <li>
                <Link to="/about" className="hover:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Get in Touch</h4>
            <p className="text-sm mb-4">Email: support@clothify.com</p>
            <p className="text-sm mb-4">Phone: +1 (123) 456-7890</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Clothify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
