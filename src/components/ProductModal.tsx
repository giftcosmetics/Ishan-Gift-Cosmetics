import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  ZoomIn,
  Phone,
} from 'lucide-react';
import { Product, StoreInfo } from '../types';
import { images as imageAssets } from '../config/images';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  storeInfo: StoreInfo;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  allProducts,
  storeInfo,
  onClose,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [imageAssets.defaultFallback];

  const currentImage = images[selectedImageIndex] || images[0];

  const effectivePrice = product.offerPrice ?? product.price;
  const hasDiscount = product.offerPrice && product.offerPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.offerPrice ?? 0)) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  // Related products from same category
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Ishan Gift & Cosmetics, Budge Budge, Kolkata!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      id="product-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0e1015] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-stone-300 hover:text-white hover:bg-black flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Zoom */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-stone-950/60 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          {/* Main Zoomable Image Canvas */}
          <div
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-white/10 cursor-crosshair group select-none"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={currentImage}
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-transform duration-150 ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    }
                  : undefined
              }
            />

            {/* Hover Instruction Overlay */}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/75 border border-white/10 text-[10px] text-stone-300 flex items-center gap-1 backdrop-blur-sm pointer-events-none">
              <ZoomIn className="w-3 h-3 text-[#d4af37]" />
              <span>Hover to Zoom</span>
            </div>

            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Strip for multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === index
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>100% Authentic Brand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Fast Budge Budge & Kolkata Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full border border-[#d4af37]/20">
                {product.category.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="text-stone-400 hover:text-white p-1 rounded transition-colors text-xs flex items-center gap-1"
                  title="Share product link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-white/10">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-stone-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-stone-400">Inclusive of all taxes</span>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 text-red-300 text-xs font-medium border border-red-500/30">
                  Currently Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 text-amber-300 text-xs font-medium border border-amber-500/30 animate-pulse">
                  Hurry! Only {product.stock} units remaining in Budge Budge store
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                  <Check className="w-3 h-3" /> In Stock at 243, M.G. Road Store
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Product Details
              </h4>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Specifications if available */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-5 bg-white/5 rounded-xl p-3 border border-white/10">
                <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-stone-500 text-[10px] uppercase font-mono">{k}</span>
                      <span className="text-stone-200 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-medium text-stone-400">Quantity:</span>
                <div className="flex items-center bg-white/5 border border-white/15 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-stone-300 hover:text-white hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-white font-mono min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-stone-300 hover:text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-400">
                  Total: ₹{(effectivePrice * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Add to Bag Button */}
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'gold-gradient-bg text-black hover:brightness-110 shadow-lg shadow-[#d4af37]/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              {/* Call Store Concierge Button */}
              <a
                id="modal-call-store-btn"
                href={`tel:${storeInfo.phone}`}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white border border-white/15 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Call Store Concierge</span>
              </a>
            </div>

            <p className="text-center text-[11px] text-stone-400 pt-1">
              Store Pickup Available at 243, M.G. Road (Opposite Bina Cinema), Budge Budge • Delivery across Kolkata
            </p>
          </div>

          {/* Related Products Section */}
          {related.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Related From This Boutique
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {related.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="group/rel text-left bg-white/5 p-2 rounded-xl border border-white/5 hover:border-[#d4af37]/40 transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full aspect-square object-cover rounded-lg mb-1.5"
                    />
                    <div className="text-[11px] font-medium text-stone-200 group-hover/rel:text-[#d4af37] line-clamp-1">
                      {rel.name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      ₹{(rel.offerPrice ?? rel.price).toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
