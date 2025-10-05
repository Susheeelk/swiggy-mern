import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-10">
            <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                {/* Column 1: Logo and Description */}
                <div>
                    <div className="text-2xl font-bold text-orange-500">
                        SwiggyClone
                    </div>

                    <p className="text-sm text-gray-600">
                        Your favorite meals delivered fast at your door. Enjoy fresh food with a single tap.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-md font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-orange-500">Home</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500">Contact</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500">Terms & Conditions</a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Social Links */}
                <div>
                    <h4 className="text-md font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-orange-500">
                            <FaFacebook size={20} />
                        </a>
                        <a href="#" className="hover:text-orange-500">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" className="hover:text-orange-500">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>

                {/* Column 4: Contact Info */}
                <div>
                    <h4 className="text-md font-semibold mb-3">Get in Touch</h4>
                    <p className="text-sm text-gray-600">Email: support@example.com</p>
                    <p className="text-sm text-gray-600">Phone: +91 12345 67890</p>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-4 py-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Swiggy Clone. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
