export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  offerPrice?: number;
  description: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  specifications?: Record<string, string>;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface HeroSlide {
  id: string;
  pageNumber: number; // 1 to 7
  title: string;
  subtitle: string;
  badgeText: string;
  image: string;
  ctaText: string;
  ctaAction: 'shop' | 'offers' | 'whatsapp' | 'category';
  categoryTarget?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  image: string;
  validUntil: string;
  code?: string;
  categoryTag?: string;
  highlightColor?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productPurchased?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  featuredOnly: boolean;
  onOfferOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';
}

export interface StoreInfo {
  name: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  openingHours: string;
  established?: string;
  logo?: string;
}
