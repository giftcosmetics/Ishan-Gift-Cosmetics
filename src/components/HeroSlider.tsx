import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Gift,
  Flame,
  Check,
  Star,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { HeroSlide, StoreInfo } from '../types';
import { images } from '../config/images';

interface HeroSliderProps {
  slides: HeroSlide[];
  storeInfo: StoreInfo;
  backgroundImage?: string;
  onShopNow: () => void;
  onExploreCategory?: (category: string) => void;
  onExploreOffers?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  storeInfo,
  backgroundImage,
  onShopNow,
  onExploreCategory,
  onExploreOffers,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Guarantee 7 slides exist or fallback
  const safeSlides = slides.length >= 7 ? slides.slice(0, 7) : slides;
  const currentSlide = safeSlides[currentIndex] || safeSlides[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  }, [safeSlides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  }, [safeSlides.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  const handleSlideCta = () => {
    if (!currentSlide) return;
    if (currentSlide.ctaAction === 'category' && currentSlide.categoryTarget && onExploreCategory) {
      onExploreCategory(currentSlide.categoryTarget);
    } else if (currentSlide.ctaAction === 'offers' && onExploreOffers) {
      onExploreOffers();
    } else {
      onShopNow();
    }
  };

  return (
    <section
      id="hero-slider-section"
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-10"
    >
      {/* Upper Locked Background: Royal Emerald & Gold Deer Statues Showcase - High Visibility, Rich Atmosphere, NOT Black */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={backgroundImage || images.hero}
          alt="Ishan Gift & Cosmetics Royal Deer Masterpiece"
          className="w-full h-full object-cover object-[center_32%] scale-105 transform-gpu transition-all duration-700 opacity-90 brightness-100 contrast-110"
        />
        {/* Balanced optical overlay: Rich warm royal atmosphere that preserves the vivid emerald deer, the candle lanterns and golden halo while ensuring crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0609]/90 via-[#0B0609]/55 to-[#0B0609]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" />
        {/* Ambient warm champagne radial glow highlighting the deer showpiece on the right */}
        <div className="absolute top-1/3 right-1/4 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Brand Hero Title & Details */}
        <div className="lg:col-span-6 space-y-5">
          {/* Refined Promotional Strip - Thinner, cleaner, more sophisticated */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-1 rounded-full border border-[#C9A227]/35 bg-[#121110]/90 backdrop-blur-sm text-[10.5px] sm:text-[11px] tracking-[0.18em] font-sans uppercase text-[#D6B85A]">
            <Sparkles className="w-3 h-3 text-[#C9A227] shrink-0" />
            <span className="font-semibold text-[#F3F0E8]">Premier Boutique</span>
            <span className="text-[#C9A227]/40">•</span>
            <span className="text-[#A9A59C]">Budge Budge, Kolkata</span>
            <span className="text-[#C9A227]/40 hidden sm:inline">•</span>
            <span className="text-[#A9A59C] hidden sm:inline">243, M.G. Road (Opp. Bina Cinema)</span>
          </div>

          {/* Main Brand Title in Aesthetic Haute-Couture Luxury Typography */}
          <div className="space-y-2">
            <h1 className="font-ishan-brand text-3xl sm:text-5xl lg:text-6xl font-black tracking-[0.08em] sm:tracking-[0.11em] leading-[1.14] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FFF3D1] to-[#E3C565]">
                ISHAN
              </span>
              <span className="block font-ishan-brand text-2xl sm:text-4xl lg:text-[46px] font-bold tracking-[0.12em] sm:tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#F0D278] via-[#C9A227] to-[#99731B] mt-1">
                GIFT <span className="font-cormorant italic font-normal text-[#FDEAB3] text-3xl sm:text-5xl">&amp;</span> COSMETICS
              </span>
            </h1>
            <p className="font-cormorant italic text-[#E5C158] text-lg sm:text-2xl font-normal tracking-wide flex items-center gap-2 drop-shadow-md">
              <span>Fine Beauty, Imported Fragrances &amp; Curated Keepsakes</span>
            </p>
          </div>

          {/* Tagline */}
          <div className="text-[11px] sm:text-xs font-sans tracking-[0.22em] text-[#C9A227] font-semibold uppercase">
            CERTIFIED COSMETICS • 24K MATTE BRIDAL JEWELRY • RARE GIFTING
          </div>

          {/* Descriptive Copy */}
          <p className="text-[#A9A59C] text-sm sm:text-base leading-relaxed font-light max-w-xl">
            Budge Budge's most celebrated landmark emporium. Discover an unmatched collection of 1,000+ authentic branded cosmetics, handcrafted bridal jewelry, French fragrances, collector figurines, and curated gifts right beside Bina Cinema Hall.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-explore-products-btn"
              onClick={onShopNow}
              className="px-6 sm:px-7 py-3 rounded border border-[#C9A227] bg-[#C9A227] hover:bg-[#D6B85A] text-black font-semibold text-xs sm:text-sm tracking-wider uppercase font-sans flex items-center gap-2 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore 1,000+ Products</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-browse-departments-btn"
              onClick={() => {
                const catSection = document.getElementById('categories-section');
                if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded border border-[#C9A227]/40 hover:border-[#C9A227] bg-[#121110] hover:bg-[#1A1916] text-[#F3F0E8] font-medium text-xs sm:text-sm tracking-wider uppercase font-sans flex items-center gap-2 transition-all duration-200"
            >
              <Gift className="w-4 h-4 text-[#C9A227]" />
              <span>Browse Departments</span>
            </button>
          </div>

          {/* 4 Feature Badges Row - Clean, Architectural, Thin Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-[#C9A227]/20">
            <div className="bg-[#121110] border border-[#C9A227]/20 rounded p-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Genuine</span>
              </div>
              <p className="text-[10px] text-[#A9A59C] mt-0.5">Authentic Salon Makeup</p>
            </div>

            <div className="bg-[#121110] border border-[#C9A227]/20 rounded p-2.5">
              <div className="flex items-center gap-1.5 text-[#D6B85A] text-xs font-medium font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>24K Matte Gold</span>
              </div>
              <p className="text-[10px] text-[#A9A59C] mt-0.5">Bridal Jewelry Sets</p>
            </div>

            <div className="bg-[#121110] border border-[#C9A227]/20 rounded p-2.5">
              <div className="flex items-center gap-1.5 text-[#D6B85A] text-xs font-medium font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Budge Budge</span>
              </div>
              <p className="text-[10px] text-[#A9A59C] mt-0.5">Beside Bina Cinema</p>
            </div>

            <div className="bg-[#121110] border border-[#C9A227]/20 rounded p-2.5">
              <div className="flex items-center gap-1.5 text-[#D6B85A] text-xs font-medium font-sans">
                <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
                <span>1,000+ Items</span>
              </div>
              <p className="text-[10px] text-[#A9A59C] mt-0.5">Gifts, Perfumes &amp; Decor</p>
            </div>
          </div>
        </div>

        {/* Right Column: 7-Page Slide Beside Ishan Gift & Cosmetics */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            id="hero-interactive-slide-card"
            className="w-full max-w-md sm:max-w-lg aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-2xl relative bg-[#0E0D0B] flex flex-col justify-between group"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Slide Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                loading="eager"
              />
              {/* Vignettes for clarity and readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/65" />
              <div className="absolute inset-0 border border-[#C9A227]/20 rounded-2xl pointer-events-none" />
            </div>

            {/* Top Bar Badges */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-[#C9A227]/25 text-[10.5px] font-sans uppercase tracking-wider text-[#D6B85A]">
                <Flame className="w-3 h-3 text-[#C9A227] fill-[#C9A227]" />
                <span>Featured Showcase</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[10.5px] font-mono text-[#A9A59C]">
                <Sparkles className="w-3 h-3 text-[#C9A227]" />
                <span>Manual Slide</span>
              </div>
            </div>

            {/* Middle Nav Chevron Buttons on sides */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-[#F3F0E8] border border-[#C9A227]/30 flex items-center justify-center transition-all active:scale-90"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-[#F3F0E8] border border-[#C9A227]/30 flex items-center justify-center transition-all active:scale-90"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Slide Info Overlay Box */}
            <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pt-12 space-y-3">
              <div>
                <div className="text-[10.5px] font-sans uppercase tracking-[0.2em] text-[#C9A227] font-semibold mb-1">
                  {currentSlide.badgeText || `${currentIndex + 1} OF 7 • BOUTIQUE SHOWCASE`}
                </div>
                <h3
                  onClick={handleSlideCta}
                  className="font-cinzel text-xl sm:text-2xl font-bold text-[#F3F0E8] hover:text-[#D6B85A] cursor-pointer transition-colors"
                >
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A9A59C] font-light mt-1 line-clamp-2">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* 7 Segment Progress Bars */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {safeSlides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
                      currentIndex === i
                        ? 'bg-[#C9A227]'
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Footer Controls Row: "Slide 1 of 7" + Prev / Next */}
              <div className="flex items-center justify-between pt-2 border-t border-[#C9A227]/15 text-xs">
                <div className="text-[#A9A59C] font-sans text-[11px] tracking-wider uppercase">
                  Slide <span className="font-semibold text-[#F3F0E8]">{currentIndex + 1}</span> of{' '}
                  <span className="text-[#A9A59C]">{safeSlides.length}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="px-2.5 py-1 rounded bg-[#121110] hover:bg-[#1A1916] text-[#A9A59C] hover:text-[#F3F0E8] text-[11px] font-sans uppercase tracking-wider flex items-center gap-1 transition-colors border border-[#C9A227]/25"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-2.5 py-1 rounded bg-[#121110] hover:bg-[#1A1916] text-[#A9A59C] hover:text-[#F3F0E8] text-[11px] font-sans uppercase tracking-wider flex items-center gap-1 transition-colors border border-[#C9A227]/25"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
