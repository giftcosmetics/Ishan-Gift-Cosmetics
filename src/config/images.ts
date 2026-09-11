/**
 * =======================================================================
 * CENTRALIZED WEBSITE IMAGE CONFIGURATION
 * =======================================================================
 * 
 * ALL photos used on Ishan Gift & Cosmetics are centrally controlled here.
 * To change or replace any photo on your website:
 * 
 * 1. Place your new image file in the '/public/assets/' folder with simple names
 *    (e.g., hero-main.jpg, perfume.jpg, cosmetics.jpg, etc.)
 * 2. Update the corresponding path in the 'images' object below.
 *    OR simply replace the image file in '/public/assets/' with the same filename.
 * 
 * NO Unsplash or external stock photos are used.
 * Only images you manually upload are referenced here.
 * =======================================================================
 */

import royalDeerHeroImage from '../assets/images/emerald_deer_1788950843652.jpg';
import heroInteractiveSlideImage from '../assets/images/regenerated_image_1788973027464.png';
import fragranceLoungeImage from '../assets/images/regenerated_image_1789033435803.png';
import bridalVaultImage from '../assets/images/regenerated_image_1789033443548.png';
import hamperWorkshopImage from '../assets/images/regenerated_image_1789033451279.png';

/**
 * Robust asset resolver that respects Vite's base path (e.g. on GitHub Pages or dev server)
 */
export function resolveAsset(path: string | undefined | null): string {
  if (!path) return '';
  if (
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

export { royalDeerHeroImage };

export const images = {
  // Locked Hero Upper Background (Official Royal Emerald & Gold Deer Statues Showcase)
  hero: royalDeerHeroImage,

  // Core Boutique Specialties
  giftBox: hamperWorkshopImage,
  perfume: fragranceLoungeImage,
  cosmetics: resolveAsset('/assets/cosmetics.jpg'),
  jewelry: bridalVaultImage,
  keepsakes: resolveAsset('/assets/keepsakes.jpg'),
  skincare: resolveAsset('/assets/skincare.jpg'),
  storeShowcase: heroInteractiveSlideImage,

  // 10 Curated Boutique Categories (All 100% manual local images)
  categories: {
    perfumes: fragranceLoungeImage,
    makeup: resolveAsset('/assets/cosmetics.jpg'),
    skincare: resolveAsset('/assets/skincare.jpg'),
    artificialJewelry: bridalVaultImage,
    giftItems: hamperWorkshopImage,
    hairCare: resolveAsset('/assets/skincare.jpg'),
    homeDecor: resolveAsset('/assets/keepsakes.jpg'),
    toys: hamperWorkshopImage,
    partySupplies: hamperWorkshopImage,
    stationery: resolveAsset('/assets/keepsakes.jpg'),
  },

  // 7-Page Hero Slide Carousel (Slide 1 is the interactive slide card centerpiece)
  heroSlides: {
    slide1: heroInteractiveSlideImage,
    slide2: resolveAsset('/assets/keepsakes.jpg'),
    slide3: bridalVaultImage,
    slide4: fragranceLoungeImage,
    slide5: resolveAsset('/assets/cosmetics.jpg'),
    slide6: hamperWorkshopImage,
    slide7: resolveAsset('/assets/skincare.jpg'),
  },

  // About Section & Flagship Showroom
  about: {
    flagshipShowroom: heroInteractiveSlideImage,
    fragranceLounge: fragranceLoungeImage,
    bridalVault: bridalVaultImage,
    cosmeticsStudio: resolveAsset('/assets/cosmetics.jpg'),
    hamperWorkshop: hamperWorkshopImage,
  },

  // Festive & Seasonal Offers
  offers: {
    durgaPuja: resolveAsset('/assets/bridal-jewelry.jpg'),
    diwali: resolveAsset('/assets/gift-box.jpg'),
    valentines: resolveAsset('/assets/perfume.jpg'),
    bridalGlow: resolveAsset('/assets/skincare.jpg'),
  },

  // Fallback image for new products or missing uploads
  defaultFallback: resolveAsset('/assets/cosmetics.jpg'),
};

export default images;
