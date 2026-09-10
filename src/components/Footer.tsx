import React from 'react';
import { MapPin, Phone, MessageCircle, Instagram, Mail, Clock, Sparkles } from 'lucide-react';
import { StoreInfo, Category } from '../types';

interface FooterProps {
  storeInfo: StoreInfo;
  categories: Category[];
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeInfo,
  categories,
  onNavigate,
  onSelectCategory,
}) => {
  const [logoError, setLogoError] = React.useState(false);

  React.useEffect(() => {
    setLogoError(false);
  }, [storeInfo.logo]);

  return (
    <footer id="main-footer" className="bg-[#050608] border-t border-white/10 text-stone-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c49a26] to-[#694e09] p-[1.5px] shadow-lg shadow-[#d4af37]/20 shrink-0 overflow-hidden">
                {storeInfo.logo && !logoError ? (
                  <img
                    src={storeInfo.logo}
                    alt={storeInfo.name}
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0d0e12] flex items-center justify-center">
                    <span className="font-cinzel text-base font-bold text-[#d4af37]">IG</span>
                  </div>
                )}
              </div>
              <div>
                <span className="font-ishan text-xl font-bold text-white tracking-wider">
                  ISHAN <span className="gold-gradient-text">GIFT &amp; COSMETICS</span>
                </span>
                <div className="text-xs font-mono text-[#d4af37] uppercase tracking-wider">
                  Budge Budge, Kolkata
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-sm">
              Fine gifts, imported perfumes, bridal jewelry, and salon cosmetics located opposite Bina Cinema on MG Road, Budge Budge, Kolkata.
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-start gap-2.5 text-stone-300">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Open All 7 Days: 10:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-300">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${storeInfo.phone}`} className="hover:text-white transition-colors">
                  {storeInfo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home' },
                { id: 'shop', label: 'Product Catalog' },
                { id: 'categories', label: '10 Boutiques' },
                { id: 'offers', label: 'Festival Offers' },
                { id: 'new-arrivals', label: 'New Arrivals' },
                { id: 'about', label: 'Our Story & Gallery' },
                { id: 'contact', label: 'Store Directions' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 10 Department Categories */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-[#d4af37] transition-colors truncate text-left w-full"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Support & Contact */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4">
              Store Support
            </h4>
            <p className="text-xs text-stone-400 font-light mb-3 leading-relaxed">
              Need personalized fragrance recommendations or bridal gift styling? Visit our Budge Budge showroom or call our store concierge.
            </p>
            <a
              href={`tel:${storeInfo.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold hover:bg-[#d4af37]/25 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {storeInfo.phone}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Ishan Gift &amp; Cosmetics. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137</span>
            <span>•</span>
            <span className="text-[#d4af37]">Fine Beauty &amp; Gifting</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
