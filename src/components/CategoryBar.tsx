import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-cinzel font-semibold tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Collections</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Explore Our <span className="gold-gradient-text">10 Premier Boutiques</span>
        </h2>
        <p className="text-stone-300 text-sm sm:text-base font-medium mb-2">
          Curated Fine Gifts, French Fragrances, Runway Makeup, Bridal Jewelry &amp; Home Decor
        </p>
        <p className="text-stone-400 text-xs sm:text-sm font-light">
          Handpicked premier products available in-store at 243, M.G. Road (Opposite Bina Cinema), Budge Budge and for prompt delivery across Kolkata.
        </p>
      </div>

      {/* Category Grid - 10 Distinct Premier Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative h-48 sm:h-60 rounded-2xl overflow-hidden text-left transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none ${
                isSelected
                  ? 'ring-2 ring-[#d4af37] shadow-xl shadow-[#d4af37]/25'
                  : 'border border-white/10 hover:border-[#d4af37]/50'
              }`}
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient Scrims */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/40 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

              {/* Selection / Hover Glow border */}
              <div
                className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
                  isSelected ? 'opacity-100 border border-[#d4af37]' : 'opacity-0 group-hover:opacity-100 border border-[#d4af37]/40'
                }`}
              />

              {/* Category Card Content */}
              <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-between z-10">
                {/* Top: Item Count & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-mono font-medium text-amber-200/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                    {cat.itemCount || 30}+ Items
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-stone-300 group-hover:text-black group-hover:bg-[#d4af37] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom: English Name & Description */}
                <div>
                  <div className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-amber-100 tracking-wide line-clamp-1 transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-stone-400 line-clamp-2 font-light mt-0.5">
                    {cat.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
