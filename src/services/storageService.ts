import { Category, CustomerReview, HeroSlide, Offer, Product, StoreInfo } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  INITIAL_OFFERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  STORE_INFO,
} from '../data/initialData';
import { images } from '../config/images';

const STORAGE_KEYS = {
  PRODUCTS: 'ishan_products_v4',
  CATEGORIES: 'ishan_categories_v4',
  SLIDES: 'ishan_slides_v4',
  OFFERS: 'ishan_offers_v4',
  REVIEWS: 'ishan_reviews_v4',
  STORE_INFO: 'ishan_store_info_v4',
  HERO_BACKGROUND: 'ishan_hero_bg_v4',
  ADMIN_SESSION: 'ishan_owner_session_v1',
};

// Owner Credentials mandated by prompt
export const OWNER_CREDENTIALS = {
  email: 'Ishanstores09@gmail.com',
  password: 'Ishan2012@',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ==========================================
// INDEXED-DB STORAGE LAYER (UNLIMITED QUOTA)
// ==========================================
const IDB_NAME = 'ishan_luxury_store_idb';
const IDB_STORE = 'store_kv';
const IDB_VERSION = 1;

let idbPromise: Promise<IDBDatabase | null> | null = null;

function getIDB(): Promise<IDBDatabase | null> {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        console.warn('Could not open IndexedDB:', req.error);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB open exception:', e);
      resolve(null);
    }
  });
  return idbPromise;
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getIDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  } catch (err) {
    console.warn('IDB put error:', err);
  }
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  } catch (err) {
    return null;
  }
}

export async function idbRemove(key: string): Promise<void> {
  try {
    const db = await getIDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  } catch (err) {
    console.warn('IDB delete error:', err);
  }
}

// ==========================================
// MASTER IN-MEMORY CACHES & SAFE LOCALSTORAGE
// ==========================================
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedSlides: HeroSlide[] | null = null;
let cachedOffers: Offer[] | null = null;
let cachedHeroBg: string | null = null;
let isHydratedFromIDB = false;

function cleanLocalStorageQuota(): void {
  try {
    // If quota is tight, remove heavy keys from localStorage (they are safe in IDB & memory)
    localStorage.removeItem(STORAGE_KEYS.HERO_BACKGROUND);
    localStorage.removeItem('ishan_products_v3');
    localStorage.removeItem('ishan_products_v2');
    localStorage.removeItem('ishan_slides_v3');
    localStorage.removeItem('ishan_categories_v3');
  } catch (ignored) {}
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`[Storage] Quota notice for "${key}". Cleaning up and relying on IndexedDB.`);
    cleanLocalStorageQuota();
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e2) {
      // Graceful degradation: IDB and in-memory cache maintain state safely
      return false;
    }
  }
}

// Background asynchronous hydration from IndexedDB
async function hydrateFromIndexedDB(): Promise<void> {
  if (isHydratedFromIDB) return;
  try {
    const [idbProds, idbSlides, idbCats, idbOffers, idbBg] = await Promise.all([
      idbGet<Product[]>(STORAGE_KEYS.PRODUCTS),
      idbGet<HeroSlide[]>(STORAGE_KEYS.SLIDES),
      idbGet<Category[]>(STORAGE_KEYS.CATEGORIES),
      idbGet<Offer[]>(STORAGE_KEYS.OFFERS),
      idbGet<string>(STORAGE_KEYS.HERO_BACKGROUND),
    ]);

    let changed = false;
    if (idbProds && Array.isArray(idbProds) && idbProds.length > 0) {
      cachedProducts = idbProds;
      changed = true;
    }
    if (idbSlides && Array.isArray(idbSlides) && idbSlides.length > 0) {
      cachedSlides = idbSlides;
      changed = true;
    }
    if (idbCats && Array.isArray(idbCats) && idbCats.length > 0) {
      cachedCategories = idbCats;
      changed = true;
    }
    if (idbOffers && Array.isArray(idbOffers) && idbOffers.length > 0) {
      cachedOffers = idbOffers;
      changed = true;
    }
    if (idbBg && typeof idbBg === 'string' && idbBg.trim().length > 0) {
      cachedHeroBg = idbBg;
      changed = true;
    }

    isHydratedFromIDB = true;
    if (changed) {
      notifyListeners();
    }
  } catch (err) {
    console.warn('IDB hydration warning:', err);
  }
}

if (typeof window !== 'undefined') {
  hydrateFromIndexedDB();
}

// ==========================================
// PRODUCT MANAGEMENT
// ==========================================
export function getStoredProducts(): Product[] {
  if (cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      cachedProducts = INITIAL_PRODUCTS;
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    cachedProducts = parsed;
    return parsed;
  } catch (e) {
    console.warn('Falling back to default products:', e);
    cachedProducts = INITIAL_PRODUCTS;
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  cachedProducts = products;
  notifyListeners();

  // 1. Save directly to IndexedDB (virtually unlimited quota for HD photos)
  idbSet(STORAGE_KEYS.PRODUCTS, products);

  // 2. Safely attempt localStorage write
  try {
    safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.warn('LocalStorage saveProducts fallback to IDB:', e);
  }
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getStoredProducts();
  const newProduct: Product = {
    ...product,
    id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    rating: product.rating ?? 5.0,
    reviewsCount: product.reviewsCount ?? 1,
  };
  const updated = [newProduct, ...products];
  saveProducts(updated);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length !== products.length) {
    saveProducts(filtered);
    return true;
  }
  return false;
}

export function updateProductStock(id: string, newStock: number): void {
  updateProduct(id, { stock: Math.max(0, newStock) });
}

export function updateProductPrice(id: string, newPrice: number, newOfferPrice?: number): void {
  updateProduct(id, { price: newPrice, offerPrice: newOfferPrice });
}

// ==========================================
// 7-PAGE HERO SLIDER MANAGEMENT
// ==========================================
export function getStoredSlides(): HeroSlide[] {
  if (cachedSlides && cachedSlides.length > 0) {
    return cachedSlides;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SLIDES);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
      cachedSlides = INITIAL_HERO_SLIDES;
      return INITIAL_HERO_SLIDES;
    }
    const parsed: HeroSlide[] = JSON.parse(raw);
    if (parsed.length < 7) {
      const merged = [...INITIAL_HERO_SLIDES];
      parsed.forEach((p) => {
        const idx = merged.findIndex((m) => m.pageNumber === p.pageNumber);
        if (idx !== -1) merged[idx] = p;
      });
      const sorted = merged.sort((a, b) => a.pageNumber - b.pageNumber);
      cachedSlides = sorted;
      return sorted;
    }
    const sorted = parsed.sort((a, b) => a.pageNumber - b.pageNumber);
    cachedSlides = sorted;
    return sorted;
  } catch (e) {
    console.warn('Falling back to default slides:', e);
    cachedSlides = INITIAL_HERO_SLIDES;
    return INITIAL_HERO_SLIDES;
  }
}

export function updateSlide(pageNumber: number, updates: Partial<HeroSlide>): void {
  const slides = getStoredSlides();
  const index = slides.findIndex((s) => s.pageNumber === pageNumber);
  if (index !== -1) {
    slides[index] = { ...slides[index], ...updates };
    cachedSlides = slides;
    notifyListeners();

    // Persist to IndexedDB (safe for high-resolution images)
    idbSet(STORAGE_KEYS.SLIDES, slides);

    // Safely attempt localStorage write
    try {
      safeSetItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
    } catch (e) {
      console.warn('LocalStorage updateSlide fallback to IDB:', e);
    }
  }
}

export function resetSlidesToDefault(): void {
  cachedSlides = INITIAL_HERO_SLIDES;
  notifyListeners();
  idbSet(STORAGE_KEYS.SLIDES, INITIAL_HERO_SLIDES);
  try {
    safeSetItem(STORAGE_KEYS.SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
  } catch (e) {}
}

// ==========================================
// OFFERS MANAGEMENT
// ==========================================
export function getStoredOffers(): Offer[] {
  if (cachedOffers && cachedOffers.length > 0) {
    return cachedOffers;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
      cachedOffers = INITIAL_OFFERS;
      return INITIAL_OFFERS;
    }
    const parsed = JSON.parse(raw);
    cachedOffers = parsed;
    return parsed;
  } catch (e) {
    cachedOffers = INITIAL_OFFERS;
    return INITIAL_OFFERS;
  }
}

export function saveOffers(offers: Offer[]): void {
  cachedOffers = offers;
  notifyListeners();
  idbSet(STORAGE_KEYS.OFFERS, offers);
  try {
    safeSetItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  } catch (e) {}
}

export function updateOffer(id: string, updates: Partial<Offer>): void {
  const offers = getStoredOffers();
  const idx = offers.findIndex((o) => o.id === id);
  if (idx !== -1) {
    offers[idx] = { ...offers[idx], ...updates };
    saveOffers(offers);
  }
}

export function addOffer(offer: Omit<Offer, 'id'>): void {
  const offers = getStoredOffers();
  const newOffer = { ...offer, id: 'offer-' + Date.now() };
  saveOffers([newOffer, ...offers]);
}

export function deleteOffer(id: string): void {
  const offers = getStoredOffers();
  saveOffers(offers.filter((o) => o.id !== id));
}

// ==========================================
// CATEGORIES MANAGEMENT
// ==========================================
export function getStoredCategories(): Category[] {
  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      cachedCategories = INITIAL_CATEGORIES;
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    cachedCategories = parsed;
    return parsed;
  } catch (e) {
    cachedCategories = INITIAL_CATEGORIES;
    return INITIAL_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  cachedCategories = categories;
  notifyListeners();
  idbSet(STORAGE_KEYS.CATEGORIES, categories);
  try {
    safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.warn('LocalStorage saveCategories fallback to IDB:', e);
  }
}

export function updateCategory(id: string, updates: Partial<Category>): void {
  const categories = getStoredCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    categories[idx] = { ...categories[idx], ...updates };
    saveCategories(categories);
  }
}

// ==========================================
// HERO BACKGROUND MANAGEMENT
// ==========================================
export function getStoredHeroBackground(): string {
  if (cachedHeroBg && cachedHeroBg.trim().length > 0) {
    return cachedHeroBg;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HERO_BACKGROUND);
    if (raw && raw.trim().length > 0) {
      cachedHeroBg = raw;
      return raw;
    }
    return images.hero;
  } catch (e) {
    return images.hero;
  }
}

export function saveHeroBackground(bgImage: string): void {
  cachedHeroBg = bgImage;
  notifyListeners();

  // Save to IndexedDB (handles large images with zero quota limitation)
  idbSet(STORAGE_KEYS.HERO_BACKGROUND, bgImage);

  // Attempt safe localStorage write (if it doesn't fit, IDB retains it)
  try {
    safeSetItem(STORAGE_KEYS.HERO_BACKGROUND, bgImage);
  } catch (e) {
    console.warn('LocalStorage saveHeroBackground fallback to IDB:', e);
  }
}

export function resetHeroBackground(): void {
  cachedHeroBg = images.hero;
  notifyListeners();
  idbRemove(STORAGE_KEYS.HERO_BACKGROUND);
  try {
    localStorage.removeItem(STORAGE_KEYS.HERO_BACKGROUND);
  } catch (e) {
    console.warn('Failed to reset hero background in localStorage:', e);
  }
}

// ==========================================
// REVIEWS & STORE INFO
// ==========================================
export function getStoredReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function getStoredStoreInfo(): StoreInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORE_INFO);
    if (!raw) return STORE_INFO;
    const parsed = JSON.parse(raw);
    if (parsed.phone?.includes('98308') || parsed.whatsapp?.includes('98308') || parsed.established === '2012') {
      parsed.phone = STORE_INFO.phone;
      parsed.whatsapp = STORE_INFO.whatsapp;
      delete parsed.established;
      safeSetItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(parsed));
    }
    return {
      ...STORE_INFO,
      ...parsed,
      phone: STORE_INFO.phone,
      whatsapp: STORE_INFO.whatsapp,
      logo: parsed.logo || STORE_INFO.logo,
    };
  } catch (e) {
    return STORE_INFO;
  }
}

export function saveStoreInfo(info: StoreInfo): void {
  try {
    safeSetItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(info));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save store info:', e);
  }
}

export function saveStoreLogo(logoUrlOrBase64: string): void {
  try {
    const current = getStoredStoreInfo();
    const updated: StoreInfo = { ...current, logo: logoUrlOrBase64 };
    safeSetItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(updated));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save logo:', e);
  }
}

export function resetStoreLogo(): void {
  try {
    const current = getStoredStoreInfo();
    const updated: StoreInfo = { ...current, logo: STORE_INFO.logo };
    safeSetItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(updated));
    notifyListeners();
  } catch (e) {
    console.error('Failed to reset logo:', e);
  }
}

// ==========================================
// OWNER AUTHENTICATION
// ==========================================
export function isOwnerAuthenticated(): boolean {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!token) return false;
    const session = JSON.parse(token);
    return (
      session &&
      session.email?.toLowerCase() === OWNER_CREDENTIALS.email.toLowerCase() &&
      session.expiresAt > Date.now()
    );
  } catch (e) {
    return false;
  }
}

export function ownerLogin(email: string, pass: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();
  if (
    cleanEmail === OWNER_CREDENTIALS.email.toLowerCase() &&
    cleanPass === OWNER_CREDENTIALS.password
  ) {
    const session = {
      email: OWNER_CREDENTIALS.email,
      role: 'owner',
      token: 'ishan_auth_token_' + Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    } catch (e) {}
    notifyListeners();
    return true;
  }
  return false;
}

export function ownerLogout(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  } catch (e) {}
  notifyListeners();
}

// ==========================================
// HIGH-PERFORMANCE SMART IMAGE COMPRESSION
// ==========================================
export function compressImageFile(
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.70
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Quality compression pass
        let currentQuality = quality;
        let compressed = canvas.toDataURL('image/jpeg', currentQuality);

        // If compressed output is still greater than 140KB, reduce quality and scale down
        if (compressed.length > 150000) {
          currentQuality = 0.55;
          compressed = canvas.toDataURL('image/jpeg', currentQuality);
        }
        if (compressed.length > 150000) {
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.round(width * 0.75);
          smallCanvas.height = Math.round(height * 0.75);
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            compressed = smallCanvas.toDataURL('image/jpeg', 0.50);
          }
        }

        resolve(compressed);
      };
      img.onerror = () => resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function fileToBase64(file: File): Promise<string> {
  return compressImageFile(file);
}

// ==========================================
// WHATSAPP HELPERS
// ==========================================
export function generateWhatsAppOrderUrl(
  productName: string,
  price: number,
  storePhone = STORE_INFO.whatsapp
): string {
  const message = `Hello, I want to order "${productName}" for ₹${price.toLocaleString('en-IN')} from Ishan Gift & Cosmetics (243, MG Road, Bina Cinema, Budge Budge). Please share payment and delivery details.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppBagOrderUrl(
  items: { name: string; quantity: number; price: number }[],
  storePhone = STORE_INFO.whatsapp
): string {
  let text = `Hello Ishan Gift & Cosmetics,\nI would like to place an order for the following items:\n\n`;
  let total = 0;
  items.forEach((it, i) => {
    const lineTotal = it.price * it.quantity;
    total += lineTotal;
    text += `${i + 1}. ${it.name} (Qty: ${it.quantity}) - ₹${lineTotal.toLocaleString('en-IN')}\n`;
  });
  text += `\n*Total Order Amount: ₹${total.toLocaleString('en-IN')}*\n`;
  text += `\nDelivery Address: [Please confirm location in Budge Budge / Kolkata]`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}

// ==========================================
// BACKUP & RESET UTILITIES
// ==========================================
export function exportCatalogJson(): string {
  const data = {
    store: getStoredStoreInfo(),
    products: getStoredProducts(),
    slides: getStoredSlides(),
    offers: getStoredOffers(),
    categories: getStoredCategories(),
    heroBackground: getStoredHeroBackground(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importCatalogJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.products && Array.isArray(data.products)) {
      saveProducts(data.products);
    }
    if (data.slides && Array.isArray(data.slides)) {
      cachedSlides = data.slides;
      idbSet(STORAGE_KEYS.SLIDES, data.slides);
      safeSetItem(STORAGE_KEYS.SLIDES, JSON.stringify(data.slides));
    }
    if (data.offers && Array.isArray(data.offers)) {
      saveOffers(data.offers);
    }
    if (data.categories && Array.isArray(data.categories)) {
      saveCategories(data.categories);
    }
    if (data.heroBackground && typeof data.heroBackground === 'string') {
      saveHeroBackground(data.heroBackground);
    }
    notifyListeners();
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function resetCatalogToDefault(): void {
  cachedProducts = INITIAL_PRODUCTS;
  cachedSlides = INITIAL_HERO_SLIDES;
  cachedOffers = INITIAL_OFFERS;
  cachedCategories = INITIAL_CATEGORIES;
  cachedHeroBg = images.hero;
  notifyListeners();

  idbSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  idbSet(STORAGE_KEYS.SLIDES, INITIAL_HERO_SLIDES);
  idbSet(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  idbSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  idbRemove(STORAGE_KEYS.HERO_BACKGROUND);

  try {
    localStorage.removeItem(STORAGE_KEYS.HERO_BACKGROUND);
    safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    safeSetItem(STORAGE_KEYS.SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
    safeSetItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
    safeSetItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  } catch (e) {
    console.warn('LocalStorage reset error:', e);
  }
}
