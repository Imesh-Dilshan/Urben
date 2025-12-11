
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Lock, User } from 'lucide-react';
import { NavLink } from '../types';

const navLinks: NavLink[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'City Status', href: '#status' },
  { label: 'Contact', href: '#contact' },
];

interface HeaderProps {
  onLogin: () => void;
  onCitizenAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onCitizenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
              <Globe size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Urban Nexus
              </span>
              <span className="text-xs text-primary font-medium tracking-wide">
                EMPOWERING SMART LIVING
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={onCitizenAuth}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-all px-4 py-2 rounded-lg"
            >
              Login / Register (Citizens)
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>

            <button 
              onClick={onLogin}
              className="group flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-white hover:bg-slate-800 transition-all px-5 py-2.5 border border-slate-300 rounded-full hover:border-slate-800 hover:shadow-lg"
            >
              <Lock size={14} className="text-slate-500 group-hover:text-white transition-colors" />
              City Authority Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onCitizenAuth();
              }}
              className="w-full text-center text-gray-600 font-semibold py-3 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              Login / Register (Citizens)
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full text-center flex items-center justify-center gap-2 text-slate-700 hover:text-white hover:bg-slate-800 font-semibold py-3 border border-slate-300 rounded-lg transition-colors"
            >
              <Lock size={16} />
              City Authority Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
