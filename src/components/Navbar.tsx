import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Sparkles,
  Phone,
  Lock,
  Menu,
  X,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { StoreInfo } from '../types';

interface NavbarProps {
  storeInfo: StoreInfo;
  cartCount: number;
  isOwner: boolean;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeInfo,
  cartCount,
  isOwner,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [storeInfo.logo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'offers', label: 'Offers' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-navbar-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#0A0A0A] border-b border-[#C9A227]/25 ${
        isScrolled ? 'py-2.5 shadow-2xl' : 'py-3.5'
      }`}
    >
      {/* Top micro announcement bar - Clean, minimal, classic luxury */}
      <div className="hidden lg:flex items-center justify-between px-6 mb-2.5 text-xs text-[#A9A59C] border-b border-[#C9A227]/15 pb-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#A9A59C]">
            <MapPin className="w-3 h-3 text-[#C9A227]" />
            <span className="text-[#F3F0E8]/90 font-medium">243, M.G. Road (Opposite Bina Cinema)</span>, Budge Budge, Kolkata - 700137
          </span>
          <span className="text-[#C9A227]/30">|</span>
          <span className="flex items-center gap-1.5 text-[#A9A59C]">
            <Clock className="w-3 h-3 text-[#C9A227]" />
            Open Daily: <span className="text-[#F3F0E8]/90 font-medium">10:00 AM – 10:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#A9A59C]">
            <ShieldCheck className="w-3 h-3 text-[#C9A227]" />
            <span className="text-[#D6B85A] font-medium">100% Certified Authentic Brands</span>
          </span>
          <span className="text-[#C9A227]/30">|</span>
          <a
            href={`tel:${storeInfo.phone}`}
            className="flex items-center gap-1.5 text-[#D6B85A] hover:text-[#F3F0E8] transition-colors font-medium"
          >
            <Phone className="w-3 h-3 text-[#C9A227]" />
            Contact: {storeInfo.phone}
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Heritage Luxury Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C9A227]/40 p-0.5 flex items-center justify-center bg-[#121110] transition-colors duration-300 group-hover:border-[#C9A227] overflow-hidden shrink-0">
            {storeInfo.logo && !logoError ? (
              <img
                src={storeInfo.logo}
                alt={storeInfo.name}
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full border border-[#C9A227]/25 flex items-center justify-center bg-[#0D0C0A]">
                <span className="font-cinzel text-xs sm:text-sm font-semibold text-[#D6B85A] tracking-[0.14em]">
                  IGC
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-cinzel text-base sm:text-lg lg:text-xl font-bold tracking-[0.14em] text-[#F3F0E8] group-hover:text-[#D6B85A] transition-colors whitespace-nowrap">
              ISHAN <span className="text-[#C9A227]">GIFT &amp; COSMETICS</span>
            </span>
            <span className="text-[9.5px] sm:text-[10px] font-sans uppercase tracking-[0.22em] text-[#A9A59C]">
              Premier Boutique &bull; Budge Budge, Kolkata
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-1.5 rounded text-xs lg:text-[13px] font-sans uppercase tracking-[0.12em] transition-all duration-200 ${
                  isActive
                    ? 'text-[#F3F0E8] bg-[#C9A227]/15 border border-[#C9A227]/35 font-semibold'
                    : 'text-[#A9A59C] hover:text-[#F3F0E8] hover:bg-[#C9A227]/5 border border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            id="nav-search-btn"
            onClick={onOpenSearch}
            className="p-2 rounded border border-white/10 hover:border-[#C9A227]/40 text-[#A9A59C] hover:text-[#F3F0E8] bg-[#121110] transition-colors"
            title="Search Catalog (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Shopping Bag Drawer Trigger */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="p-2 rounded border border-white/10 hover:border-[#C9A227]/40 text-[#A9A59C] hover:text-[#F3F0E8] bg-[#121110] transition-colors relative"
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C9A227] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Owner Portal Button */}
          <button
            id="nav-admin-login-btn"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-sans uppercase tracking-wider transition-all duration-200 border ${
              isOwner
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : 'bg-[#121110] text-[#A9A59C] border-white/10 hover:border-[#C9A227]/40 hover:text-[#F3F0E8]'
            }`}
            title="Owner Portal"
          >
            <Lock className="w-3 h-3 text-[#C9A227]" />
            <span className="hidden sm:inline">{isOwner ? 'Portal' : 'Owner'}</span>
          </button>

          {/* Concierge Contact Button */}
          <a
            id="nav-store-call-btn"
            href={`tel:${storeInfo.phone}`}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[11px] font-sans uppercase tracking-wider bg-[#121110] text-[#D6B85A] border border-[#C9A227]/40 hover:bg-[#C9A227]/15 hover:text-[#F3F0E8] transition-all"
          >
            <Phone className="w-3 h-3 text-[#C9A227]" />
            <span>Concierge</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded border border-white/10 text-[#A9A59C] hover:text-white bg-[#121110]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#C9A227]/25 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="text-xs text-[#A9A59C] pb-2 border-b border-[#C9A227]/15 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>243, M.G. Road (Opposite Bina Cinema), Budge Budge</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 rounded text-xs font-sans uppercase tracking-wider transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#F3F0E8] font-semibold'
                    : 'bg-[#121110] text-[#A9A59C] hover:text-white border border-white/5'
                }`}
              >
                <div>{link.label}</div>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#C9A227]/15 flex gap-2">
            <a
              href={`tel:${storeInfo.phone}`}
              className="flex-1 py-2 rounded bg-[#C9A227] text-black text-xs font-semibold flex items-center justify-center gap-1.5 uppercase tracking-wider font-sans"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Showroom
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="px-3 py-2 rounded bg-[#121110] text-[#A9A59C] text-xs font-medium flex items-center gap-1.5 border border-white/15"
            >
              <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
              {isOwner ? 'Dashboard' : 'Owner'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
