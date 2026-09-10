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

import heroInteractiveSlideImage from '../assets/images/regenerated_image_1788973027464.png';
import fragranceLoungeImage from '../assets/images/regenerated_image_1789033435803.png';
import bridalVaultImage from '../assets/images/regenerated_image_1789033443548.png';
import hamperWorkshopImage from '../assets/images/regenerated_image_1789033451279.png';

export const images = {
  // Hero Background (Royal Deer showpiece background)
  hero: '/assets/hero-main.jpg',

  // Core Boutique Specialties
  giftBox: hamperWorkshopImage,
  perfume: fragranceLoungeImage,
  cosmetics: '/assets/cosmetics.jpg',
  jewelry: bridalVaultImage,
  keepsakes: '/assets/keepsakes.jpg',
  skincare: '/assets/skincare.jpg',
  storeShowcase: heroInteractiveSlideImage,

  // 10 Curated Boutique Categories (All 100% manual local images)
  categories: {
    perfumes: fragranceLoungeImage,
    makeup: '/assets/cosmetics.jpg',
    skincare: '/assets/skincare.jpg',
    artificialJewelry: bridalVaultImage,
    giftItems: hamperWorkshopImage,
    hairCare: '/assets/skincare.jpg',
    homeDecor: '/assets/keepsakes.jpg',
    toys: hamperWorkshopImage,
    partySupplies: hamperWorkshopImage,
    stationery: '/assets/keepsakes.jpg',
  },

  // 7-Page Hero Slide Carousel (Slide 1 is the interactive slide card centerpiece)
  heroSlides: {
    slide1: heroInteractiveSlideImage,
    slide2: '/assets/keepsakes.jpg',
    slide3: bridalVaultImage,
    slide4: fragranceLoungeImage,
    slide5: '/assets/cosmetics.jpg',
    slide6: hamperWorkshopImage,
    slide7: '/assets/skincare.jpg',
  },

  // About Section & Flagship Showroom
  about: {
    flagshipShowroom: heroInteractiveSlideImage,
    fragranceLounge: fragranceLoungeImage,
    bridalVault: bridalVaultImage,
    cosmeticsStudio: '/assets/cosmetics.jpg',
    hamperWorkshop: hamperWorkshopImage,
  },

  // Festive & Seasonal Offers
  offers: {
    durgaPuja: '/assets/bridal-jewelry.jpg',
    diwali: '/assets/gift-box.jpg',
    valentines: '/assets/perfume.jpg',
    bridalGlow: '/assets/skincare.jpg',
  },

  // Fallback image for new products or missing uploads
  defaultFallback: '/assets/cosmetics.jpg',
};

export default images;
