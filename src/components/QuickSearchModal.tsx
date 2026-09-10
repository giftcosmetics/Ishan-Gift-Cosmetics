import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'perfumes', label: 'Perfumes' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'artificial-jewelry', label: 'Jewelry' },
    { id: 'gift-items', label: 'Gifts' },
    { id: 'hair-care', label: 'Hair Care' },
    { id: 'home-decor', label: 'Home Decor' },
    { id: 'toys', label: 'Toys' },
    { id: 'party-supplies', label: 'Party' },
    { id: 'stationery', label: 'Stationery' },
  ];

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = query.trim().toLowerCase();
    if (!q) return matchesCategory;

    const matchesText =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesCategory && matchesText;
  });

  return (
    <div
      id="quick-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e1015] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-stone-950">
          <Search className="w-5 h-5 text-[#d4af37]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search perfumes, bridal jewelry, cosmetics, hampers..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-stone-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Quick Pills */}
        <div className="p-2.5 bg-black/40 border-b border-white/5 overflow-x-auto flex gap-1.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#d4af37] text-black font-semibold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-stone-300">No matching products found</p>
              <p className="text-xs text-stone-500 mt-1">
                Try searching for "perfume", "gold", "lipstick", or "choker"
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const price = item.offerPrice ?? item.price;
              return (
                <div
                  key={item.id}
                  className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-white/5 rounded-xl transition-colors group"
                >
                  <div
                    onClick={() => {
                      onClose();
                      onSelectProduct(item);
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-900 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-white group-hover:text-[#d4af37] truncate transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2">
                        <span className="uppercase text-[10px] text-amber-200/80 font-mono">
                          {item.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-cinzel text-xs sm:text-sm font-bold text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </div>
                      {item.offerPrice && (
                        <div className="text-[10px] text-stone-500 line-through">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(item);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#d4af37] hover:bg-white/10 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-white/10 text-center text-xs text-stone-400 flex items-center justify-between px-4">
          <span>{filtered.length} products available in store</span>
          <span className="text-[11px] text-[#d4af37]">243, MG Road, Budge Budge</span>
        </div>
      </div>
    </div>
  );
};
