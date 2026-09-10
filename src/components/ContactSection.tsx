import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  Clock,
  Navigation,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StoreInfo } from '../types';

interface ContactSectionProps {
  storeInfo: StoreInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ storeInfo }) => {
  const directionsMapUrl =
    'https://www.google.com/maps/search/?api=1&query=243+MG+Road+Bina+Cinema+Budge+Budge+Kolkata+700137';

  return (
    <section id="contact-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-cinzel font-semibold tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flagship Boutique & Inquiries</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Visit Us at <span className="gold-gradient-text">Budge Budge, Kolkata</span>
        </h2>
        <p className="text-stone-300 text-sm sm:text-base font-medium mb-2">
          Experience our physical boutique showroom or call our concierge contact
        </p>
        <p className="text-stone-400 text-xs sm:text-sm font-light">
          Located prominently opposite Bina Cinema Hall on MG Road. Open all seven days with dedicated customer assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Store Details Cards */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Main Address Card */}
          <div className="bg-[#0e1015] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-ishan text-lg sm:text-2xl font-bold text-white tracking-wide">
                  ISHAN <span className="gold-gradient-text">GIFT &amp; COSMETICS</span>
                </h3>
                <div className="text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-2">
                  Premier Boutique Emporium
                </div>
                <p className="text-stone-300 text-sm leading-relaxed font-light">
                  {storeInfo.address}
                </p>
                <p className="text-amber-300/90 text-xs font-medium mt-1">
                  Landmark: {storeInfo.landmark}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">
                  {storeInfo.city} - {storeInfo.pincode}
                </p>
              </div>
            </div>

            <a
              href={directionsMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#d4af37] text-xs font-medium border border-white/10 transition-colors w-full justify-center"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
            </a>
          </div>

          {/* Operating Hours & Contact Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hours */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 text-[#d4af37] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-cinzel font-bold text-white">Opening Hours</span>
              </div>
              <p className="text-xs text-stone-300 font-medium">Monday – Sunday</p>
              <p className="text-sm font-bold text-amber-300 mt-1">10:00 AM – 10:00 PM</p>
              <p className="text-[11px] text-stone-500 mt-1">Open 365 days a year</p>
            </div>

            {/* Direct Phone */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 text-[#d4af37] mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-cinzel font-bold text-white">Direct Contact</span>
              </div>
              <a
                href={`tel:${storeInfo.phone}`}
                className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors block mt-1"
              >
                {storeInfo.phone}
              </a>
              <p className="text-[11px] text-stone-400 mt-1">Instant voice assistance</p>
            </div>
          </div>

          {/* Email & Instagram Contact Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`mailto:${storeInfo.email}`}
              className="p-4 rounded-2xl bg-[#0e1015] hover:bg-white/5 border border-white/10 text-stone-200 flex items-center gap-3 transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Email Concierge</div>
                <div className="text-[11px] text-stone-400 font-mono truncate">{storeInfo.email}</div>
              </div>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-tr from-purple-900/20 via-pink-900/20 to-amber-900/20 hover:border-pink-500/50 border border-white/10 text-stone-200 flex items-center gap-3 transition-colors"
            >
              <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Follow on Instagram</div>
                <div className="text-[11px] text-stone-400">{storeInfo.instagram}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Google Maps Interactive Embed + Visual Marker */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[400px] lg:h-full min-h-[380px] rounded-3xl overflow-hidden border border-white/15 bg-stone-950 shadow-2xl">
            {/* Embedded Google Map iframe centered around Budge Budge Bina Cinema */}
            <iframe
              title="Ishan Gift & Cosmetics Store Location"
              src="https://maps.google.com/maps?q=Bina%20Cinema,%20MG%20Road,%20Budge%20Budge,%20Kolkata%20700137&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale-[25%] contrast-[110%] opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Store Badge on Map */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto max-w-sm bg-[#0e1015]/95 border border-[#d4af37]/40 rounded-2xl p-3.5 backdrop-blur-md shadow-2xl pointer-events-none">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-ishan font-bold text-[#d4af37] tracking-wider">
                  ISHAN GIFT &amp; COSMETICS
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-1 font-light">
                243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
