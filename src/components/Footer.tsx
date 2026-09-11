import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  Clock,
  Sparkles,
  Lock,
  Camera,
  Package,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { StoreInfo, Category } from '../types';

interface FooterProps {
  storeInfo: StoreInfo;
  categories: Category[];
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  isOwner?: boolean;
  onOpenAdmin?: (tab?: 'photos' | 'inventory' | 'add-product' | 'slides' | 'offers' | 'data') => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeInfo,
  categories,
  onNavigate,
  onSelectCategory,
  isOwner = false,
  onOpenAdmin,
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
                <span className="font-ishan-brand text-xl font-bold text-white tracking-[0.1em]">
                  ISHAN{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0D278] via-[#C9A227] to-[#B38B22]">
                    GIFT <span className="font-cormorant italic font-normal text-[#FDEAB3] text-xl">&amp;</span> COSMETICS
                  </span>
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

          {/* Help & Support + Store Owner Panel Section */}
          <div className="space-y-4">
            <div>
              <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Help &amp; Support</span>
              </h4>
              <p className="text-xs text-stone-400 font-light mb-3 leading-relaxed">
                Need product styling, fragrance advice, or order assistance? Visit our showroom or contact our concierge.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Call {storeInfo.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Ishan Gift & Cosmetics, I need assistance.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Help</span>
                </a>
              </div>
            </div>

            {/* Dedicated Owner Panel in Help & Support */}
            {onOpenAdmin && (
              <div
                id="footer-help-support-owner-panel"
                className="p-3.5 rounded-2xl bg-gradient-to-br from-[#14120e] via-[#0d0c0a] to-[#12110e] border border-[#d4af37]/45 shadow-xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                        Owner Panel
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Boutique Control &amp; Inventory
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono border flex items-center gap-1 ${
                      isOwner
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-stone-900 text-stone-400 border-white/10'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOwner ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                      }`}
                    />
                    <span>{isOwner ? 'Active' : 'Locked'}</span>
                  </span>
                </div>

                {/* Primary Launch Owner Dashboard Button */}
                <button
                  id="help-support-owner-dashboard-btn"
                  onClick={() => onOpenAdmin('photos')}
                  className="w-full py-2.5 px-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs flex items-center justify-between shadow-lg shadow-[#d4af37]/15 hover:brightness-105 active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-black" />
                    <span>{isOwner ? 'Open Owner Dashboard' : 'Open Owner Panel (Login)'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>

                {/* Direct Shortcut Badges */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                  <button
                    onClick={() => onOpenAdmin('photos')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 flex items-center gap-1.5 transition-colors text-left"
                    title="Change Logo, Hero Background & Slide Photos"
                  >
                    <Camera className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">Photo Hub</span>
                  </button>

                  <button
                    onClick={() => onOpenAdmin('inventory')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 flex items-center gap-1.5 transition-colors text-left"
                    title="View Catalog Products & Stock"
                  >
                    <Package className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">Catalog &amp; Stock</span>
                  </button>

                  <button
                    onClick={() => onOpenAdmin('add-product')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 flex items-center gap-1.5 transition-colors text-left"
                    title="Add New Product with Camera Upload"
                  >
                    <Camera className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">+ Add Product</span>
                  </button>

                  <button
                    onClick={() => onOpenAdmin('slides')}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 flex items-center gap-1.5 transition-colors text-left"
                    title="Update Hero Slider 7 Pages"
                  >
                    <Sliders className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">7 Hero Slides</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Ishan Gift &amp; Cosmetics. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <span>243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137</span>
            <span>•</span>
            <span className="text-[#d4af37]">Fine Beauty &amp; Gifting</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => onOpenAdmin('photos')}
                  className="flex items-center gap-1 text-stone-400 hover:text-[#d4af37] transition-colors font-medium cursor-pointer"
                  title="Store Administration &amp; Inventory Management"
                >
                  <Lock className="w-3 h-3 text-[#d4af37]" />
                  <span>Owner Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
