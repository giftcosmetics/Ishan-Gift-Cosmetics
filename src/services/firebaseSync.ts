import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, HeroSlide, Offer, Product, StoreInfo } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  INITIAL_OFFERS,
  INITIAL_PRODUCTS,
  STORE_INFO,
} from '../data/initialData';

// Sanitize objects to remove any `undefined` values that Firestore rejects
function sanitizeData<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export type CloudSyncStatus = 'connecting' | 'connected' | 'error' | 'synced';

type SyncCallback = {
  onProducts?: (products: Product[]) => void;
  onCategories?: (categories: Category[]) => void;
  onSlides?: (slides: HeroSlide[]) => void;
  onOffers?: (offers: Offer[]) => void;
  onStoreInfo?: (info: StoreInfo) => void;
  onHeroBackground?: (bg: string) => void;
  onStatusChange?: (status: CloudSyncStatus) => void;
};

let activeUnsubscribers: Unsubscribe[] = [];
let currentStatus: CloudSyncStatus = 'connecting';
let statusListeners: Set<(status: CloudSyncStatus) => void> = new Set();

export function getCloudSyncStatus(): CloudSyncStatus {
  return currentStatus;
}

export function subscribeToSyncStatus(listener: (status: CloudSyncStatus) => void): () => void {
  statusListeners.add(listener);
  listener(currentStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

function setStatus(status: CloudSyncStatus) {
  currentStatus = status;
  statusListeners.forEach((fn) => {
    try {
      fn(status);
    } catch (e) {
      console.error('Status listener error:', e);
    }
  });
}

/**
 * Seed initial catalog to Firestore if the collections are empty on first run
 */
async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('[Firestore] Seeding initial products to Cloud Database...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((product) => {
        const ref = doc(db, 'products', product.id);
        batch.set(ref, sanitizeData(product));
      });
      await batch.commit();
      console.log('[Firestore] Seeded initial products successfully.');
    }

    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_CATEGORIES.forEach((cat) => {
        const ref = doc(db, 'categories', cat.id);
        batch.set(ref, sanitizeData(cat));
      });
      await batch.commit();
    }

    const slidesSnap = await getDocs(collection(db, 'slides'));
    if (slidesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_HERO_SLIDES.forEach((slide) => {
        const ref = doc(db, 'slides', slide.id);
        batch.set(ref, sanitizeData(slide));
      });
      await batch.commit();
    }

    const offersSnap = await getDocs(collection(db, 'offers'));
    if (offersSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_OFFERS.forEach((offer) => {
        const ref = doc(db, 'offers', offer.id);
        batch.set(ref, sanitizeData(offer));
      });
      await batch.commit();
    }

    const settingsRef = doc(db, 'store_settings', 'main');
    const settingsSnap = await getDocs(collection(db, 'store_settings'));
    if (settingsSnap.empty) {
      await setDoc(settingsRef, sanitizeData({
        storeInfo: STORE_INFO,
        heroBackground: '',
        updatedAt: new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('[Firestore] Initial seeding note:', err);
  }
}

/**
 * Initialize real-time bidirectional Firestore synchronization
 */
export function startFirestoreRealtimeSync(callbacks: SyncCallback): () => void {
  // Clear any existing active listeners
  activeUnsubscribers.forEach((unsub) => unsub());
  activeUnsubscribers = [];

  setStatus('connecting');

  // Trigger seeding in background
  seedInitialDataIfEmpty().then(() => {
    setStatus('connected');
  }).catch(() => {
    // Still proceed to listen
  });

  // 1. Real-time Products Sync
  const unsubProducts = onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      setStatus('synced');
      if (!snapshot.empty) {
        const products: Product[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Product;
          products.push({ ...data, id: d.id });
        });
        // Sort newest first or keep original order
        callbacks.onProducts?.(products);
      }
    },
    (err) => {
      console.warn('[Firestore] Products subscription note:', err);
      setStatus('error');
    }
  );
  activeUnsubscribers.push(unsubProducts);

  // 2. Real-time Categories Sync
  const unsubCategories = onSnapshot(
    collection(db, 'categories'),
    (snapshot) => {
      if (!snapshot.empty) {
        const categories: Category[] = [];
        snapshot.forEach((d) => {
          categories.push({ ...(d.data() as Category), id: d.id });
        });
        callbacks.onCategories?.(categories);
      }
    },
    (err) => console.warn('[Firestore] Categories subscription note:', err)
  );
  activeUnsubscribers.push(unsubCategories);

  // 3. Real-time Hero Slides Sync
  const unsubSlides = onSnapshot(
    collection(db, 'slides'),
    (snapshot) => {
      if (!snapshot.empty) {
        const slides: HeroSlide[] = [];
        snapshot.forEach((d) => {
          slides.push({ ...(d.data() as HeroSlide), id: d.id });
        });
        slides.sort((a, b) => a.pageNumber - b.pageNumber);
        callbacks.onSlides?.(slides);
      }
    },
    (err) => console.warn('[Firestore] Slides subscription note:', err)
  );
  activeUnsubscribers.push(unsubSlides);

  // 4. Real-time Offers Sync
  const unsubOffers = onSnapshot(
    collection(db, 'offers'),
    (snapshot) => {
      if (!snapshot.empty) {
        const offers: Offer[] = [];
        snapshot.forEach((d) => {
          offers.push({ ...(d.data() as Offer), id: d.id });
        });
        callbacks.onOffers?.(offers);
      }
    },
    (err) => console.warn('[Firestore] Offers subscription note:', err)
  );
  activeUnsubscribers.push(unsubOffers);

  // 5. Real-time Store Settings (Logo, info, hero bg)
  const unsubSettings = onSnapshot(
    doc(db, 'store_settings', 'main'),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.storeInfo && callbacks.onStoreInfo) {
          callbacks.onStoreInfo(data.storeInfo as StoreInfo);
        }
        if (typeof data.heroBackground === 'string' && callbacks.onHeroBackground) {
          callbacks.onHeroBackground(data.heroBackground);
        }
      }
    },
    (err) => console.warn('[Firestore] Store settings subscription note:', err)
  );
  activeUnsubscribers.push(unsubSettings);

  return () => {
    activeUnsubscribers.forEach((unsub) => unsub());
    activeUnsubscribers = [];
  };
}

// =======================================================
// CLOUD MUTATION HELPERS
// =======================================================

export async function cloudAddProduct(product: Product): Promise<void> {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, sanitizeData(product));
  } catch (err) {
    console.error('[Firestore] cloudAddProduct error:', err);
  }
}

export async function cloudUpdateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, sanitizeData(updates), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudUpdateProduct error:', err);
  }
}

export async function cloudDeleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('[Firestore] cloudDeleteProduct error:', err);
  }
}

export async function cloudSaveCategory(category: Category): Promise<void> {
  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, sanitizeData(category), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudSaveCategory error:', err);
  }
}

export async function cloudSaveSlide(slide: HeroSlide): Promise<void> {
  try {
    const docRef = doc(db, 'slides', slide.id);
    await setDoc(docRef, sanitizeData(slide), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudSaveSlide error:', err);
  }
}

export async function cloudSaveOffer(offer: Offer): Promise<void> {
  try {
    const docRef = doc(db, 'offers', offer.id);
    await setDoc(docRef, sanitizeData(offer), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudSaveOffer error:', err);
  }
}

export async function cloudDeleteOffer(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'offers', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('[Firestore] cloudDeleteOffer error:', err);
  }
}

export async function cloudSaveStoreInfo(info: StoreInfo): Promise<void> {
  try {
    const docRef = doc(db, 'store_settings', 'main');
    await setDoc(docRef, sanitizeData({ storeInfo: info, updatedAt: new Date().toISOString() }), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudSaveStoreInfo error:', err);
  }
}

export async function cloudSaveHeroBackground(bgUrlOrBase64: string): Promise<void> {
  try {
    const docRef = doc(db, 'store_settings', 'main');
    await setDoc(docRef, sanitizeData({ heroBackground: bgUrlOrBase64, updatedAt: new Date().toISOString() }), { merge: true });
  } catch (err) {
    console.error('[Firestore] cloudSaveHeroBackground error:', err);
  }
}
