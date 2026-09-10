import React from 'react';
import { Star, ShieldCheck, Sparkles, Quote } from 'lucide-react';
import { CustomerReview } from '../types';

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="reviews-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-cinzel font-semibold tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local Love & Trust</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Voices of Our <span className="gold-gradient-text">Cherished Patrons</span>
        </h2>
        <p className="text-stone-300 text-sm sm:text-base font-medium mb-2">
          Genuine feedback from our valued customers across Budge Budge and Kolkata
        </p>
        <p className="text-stone-400 text-xs sm:text-sm font-light">
          Real experiences from clients who trust us for their bridal ornaments, fine perfumes, and celebration hampers.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#0e1015] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#d4af37]/40 transition-all duration-300 relative group"
          >
            <Quote className="w-8 h-8 text-[#d4af37]/15 absolute top-4 right-4" />

            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? 'text-[#d4af37] fill-[#d4af37]'
                        : 'text-stone-700 fill-stone-700'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-xs sm:text-sm font-bold text-white">
                    {rev.author}
                  </div>
                  <div className="text-[11px] text-stone-500">{rev.location}</div>
                </div>

                {rev.verified && (
                  <div
                    className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30"
                    title="Verified Local Buyer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {rev.productPurchased && (
                <div className="text-[10px] text-[#d4af37]/75 font-light mt-1.5 truncate">
                  Purchased: {rev.productPurchased}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
