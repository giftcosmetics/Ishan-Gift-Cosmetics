import React from 'react';
import { Eye, ShoppingBag, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { images } from '../config/images';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isAddedToCart,
}) => {
  const effectivePrice = product.offerPrice ?? product.price;
  const hasDiscount = product.offerPrice && product.offerPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.offerPrice ?? 0)) / product.price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#0e1015] rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#d4af37]/10 transform hover:-translate-y-1"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-square overflow-hidden bg-stone-900">
        <img
          src={product.images[0] || images.defaultFallback}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1">
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#d4af37] text-black shadow-md flex items-center gap-1 w-max">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-md w-max">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div>
            {isOutOfStock ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-950/80 text-red-400 border border-red-500/40 backdrop-blur-sm">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-sm animate-pulse">
                Only {product.stock} Left
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="px-4 py-2 rounded-full bg-[#08090b]/90 border border-[#d4af37]/60 text-white hover:text-[#d4af37] hover:border-[#d4af37] text-xs font-medium flex items-center gap-1.5 shadow-xl backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="uppercase font-mono tracking-wider text-[#d4af37]/80 text-[10px]">
              {product.category.replace('-', ' ')}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 text-amber-300 text-[11px]">
                ★ {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-medium text-xs sm:text-sm text-stone-100 hover:text-[#d4af37] cursor-pointer line-clamp-2 transition-colors mb-2"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Stock Details */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-cinzel text-base sm:text-lg font-bold text-white">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-500 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            {/* View Details Button */}
            <button
              id={`view-details-btn-${product.id}`}
              onClick={() => onQuickView(product)}
              className="w-full py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="View product details"
            >
              <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Details</span>
            </button>

            {/* Add to Bag Button */}
            <button
              id={`add-to-bag-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`w-full py-2 px-2 rounded-xl text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                  : isAddedToCart
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                  : 'gold-gradient-bg text-black font-semibold hover:brightness-110 shadow-md'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
