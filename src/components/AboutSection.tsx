import React from 'react';
import { ShieldCheck, Award, Sparkles, MapPin, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { StoreInfo } from '../types';
import { images } from '../config/images';

interface AboutSectionProps {
  storeInfo: StoreInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ storeInfo }) => {
  const galleryImages = [
    {
      title: 'Fine Fragrance Counter',
      desc: 'Exclusive French and Oriental fragrance tester lounge',
      url: images.about.fragranceLounge,
    },
    {
      title: 'Bridal Polki & Kundan Vault',
      desc: 'Handcrafted wedding sets with velvet gift packaging',
      url: images.about.bridalVault,
    },
    {
      title: 'Runway Cosmetics Studio',
      desc: 'Curated skincare and premium foundations',
      url: images.about.cosmeticsStudio,
    },
    {
      title: 'Celebration Hamper Workshop',
      desc: 'Customized gift assembling for Kolkata weddings and birthdays',
      url: images.about.hamperWorkshop,
    },
  ];

  return (
    <section id="about-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
      {/* Top Story Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-cinzel font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Budge Budge Premier Boutique</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Your Premier Destination for <span className="gold-gradient-text">Beauty &amp; Celebration</span>
          </h2>

          <div className="text-amber-200/90 text-base sm:text-lg font-medium leading-relaxed">
            Kolkata’s premier destination for genuine branded cosmetics, artisanal jewelry, and curated celebration gifts.
          </div>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            Founded in the heart of Budge Budge, Kolkata, opposite the landmark Bina Cinema Hall,
            <strong> {storeInfo.name}</strong> brings world-class cosmetics, rare imported perfumes,
            royal bridal artificial jewelry, and customized celebration hampers directly to discerning shoppers.
          </p>

          <p className="text-stone-400 text-sm leading-relaxed font-light">
            We believe true elegance is found in authenticity, craftsmanship, and heartfelt personal service.
            Whether you are picking out a bride's reception choker, a long-lasting French fragrance for an evening soirée,
            or an unforgettable anniversary hamper, our experienced team ensures every purchase is an exquisite experience.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#d4af37]">500+</div>
              <div className="text-xs text-stone-400">Curated Products</div>
            </div>
            <div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-stone-400">Genuine Brands</div>
            </div>
            <div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#d4af37]">10</div>
              <div className="text-xs text-stone-400">Luxury Boutiques</div>
            </div>
          </div>
        </div>

        {/* Feature Image Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl p-2 bg-gradient-to-br from-[#d4af37]/20 to-transparent">
            <img
              src={images.about.flagshipShowroom}
              alt="Ishan Gift & Cosmetics Store Interior"
              className="w-full h-96 object-cover rounded-2xl"
            />
            <div className="absolute inset-2 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 text-[#d4af37] text-xs font-mono mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>243, M.G. Road (Opposite Bina Cinema), Budge Budge</span>
              </div>
              <div className="text-white font-cinzel font-bold text-lg">
                The Flagship Showroom
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-2">
            100% Guaranteed Authenticity
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Zero duplicate or fake products. Every cosmetic formulation, skincare serum, and perfume bottle is directly sourced from certified distributors.
          </p>
        </div>

        <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-2">
            Artisanal Gift Customization
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Custom-assembled bespoke trunks, velvet boxes, embossed tags, and gold ribbons for weddings, corporate gifting, and festivals.
          </p>
        </div>

        <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-2">
            Direct Owner Care &amp; Service
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Every request is handled directly by store management with personalized attention, shade matching, and local showroom assistance.
          </p>
        </div>
      </div>

      {/* Store Gallery Showcase */}
      <div>
        <div className="text-center mb-8">
          <h3 className="font-cinzel text-2xl font-bold text-white mb-1">
            Store Gallery & <span className="gold-gradient-text">Atmosphere</span>
          </h3>
          <p className="text-xs text-stone-400">
            A glimpse into the physical boutique in Budge Budge, Kolkata
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((g, idx) => (
            <div
              key={idx}
              id={`about-gallery-card-${idx}`}
              className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300"
            >
              <img
                src={g.url}
                alt={g.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <div className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                  {g.title}
                </div>
                <div className="text-[11px] text-stone-400 line-clamp-2 mt-0.5 font-light">
                  {g.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
