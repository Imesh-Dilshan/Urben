import React from 'react';
import { Globe, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Globe className="text-primary" size={24} />
                <span className="text-xl font-bold text-white">Urban Nexus</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Building the cities of tomorrow, today. Empowering citizens and administrators with real-time data and seamless services for a smarter, sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">City Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* For Citizens */}
          <div>
            <h4 className="text-white font-semibold mb-6">For Citizens</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Register Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Report an Issue</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pay Utilities</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Forum</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span>123 Innovation Blvd, Smart District, Tech City 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary" />
                <span>contact@urbannexus.city</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Subscribe to newsletter</p>
                <div className="flex">
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="bg-gray-800 text-white text-sm px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors">
                        Join
                    </button>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 Urban Nexus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;