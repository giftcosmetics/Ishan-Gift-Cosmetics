import React from 'react';
import { Tag, Sparkles, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { Offer, StoreInfo } from '../types';

interface OffersSectionProps {
  offers: Offer[];
  storeInfo: StoreInfo;
  onShopOfferCategory?: (category: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  storeInfo,
  onShopOfferCategory,
}) => {
  return (
    <section id="offers-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Kolkata Festival Privileges</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Special <span className="gold-gradient-text">Festive &amp; Seasonal Offers</span>
        </h2>
        <p className="text-stone-300 text-sm sm:text-base font-medium mb-2">
          Exclusive privileges on wedding beauty sets, French perfumes, and fine gift hampers
        </p>
        <p className="text-stone-400 text-xs sm:text-sm font-light">
          Updated regularly by the showroom. Enjoy authentic discounts both in our Budge Budge store and through our online catalog.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => {
          return (
            <div
              key={offer.id}
              id={`offer-card-${offer.id}`}
              className="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-gradient-to-br from-[#121319] via-[#0d0e12] to-black p-6 sm:p-7 flex flex-col justify-between group hover:border-[#d4af37]/70 transition-all duration-300 shadow-xl"
            >
              {/* Subtle background image overlay */}
              <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
              </div>

              {/* Decorative Corner Glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: offer.highlightColor || '#d4af37' }}
              />

              {/* Card Top */}
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-black gold-gradient-bg shadow-md">
                    {offer.discountBadge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Valid: {offer.validUntil}</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-amber-100 transition-colors">
                  {offer.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {offer.subtitle}
                </p>
              </div>

              {/* Card Bottom CTA & Code */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {offer.code && (
                  <div className="flex items-center gap-2 bg-black/60 border border-dashed border-[#d4af37]/50 rounded-xl px-3 py-1.5 w-fit">
                    <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-[11px] text-stone-400 font-mono uppercase">Code:</span>
                    <span className="text-xs font-mono font-bold text-amber-300">{offer.code}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {offer.categoryTag && onShopOfferCategory ? (
                    <button
                      onClick={() => onShopOfferCategory(offer.categoryTag || '')}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-xl gold-gradient-bg text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-110"
                    >
                      <span>Shop Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={`tel:${storeInfo.phone}`}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Inquire In-Store</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
