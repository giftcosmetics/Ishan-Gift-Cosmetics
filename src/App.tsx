import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Filter,
  CheckCircle2,
  Grid3X3,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { OffersSection } from './components/OffersSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  CartItem,
  FilterState,
  Product,
  Category,
  HeroSlide,
  Offer,
  CustomerReview,
  StoreInfo,
} from './types';
import {
  getStoredProducts,
  getStoredCategories,
  getStoredSlides,
  getStoredOffers,
  getStoredReviews,
  getStoredStoreInfo,
  getStoredHeroBackground,
  isOwnerAuthenticated,
  subscribeToStore,
} from './services/storageService';

export default function App() {
  // Store Data States
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [categories, setCategories] = useState<Category[]>(getStoredCategories());
  const [slides, setSlides] = useState<HeroSlide[]>(getStoredSlides());
  const [offers, setOffers] = useState<Offer[]>(getStoredOffers());
  const [reviews] = useState<CustomerReview[]>(getStoredReviews());
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(getStoredStoreInfo());
  const [heroBackground, setHeroBackground] = useState<string>(getStoredHeroBackground());

  // App UI States
  const [isOwner, setIsOwner] = useState<boolean>(isOwnerAuthenticated());
  const [activeSection, setActiveSection] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Catalog States
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    priceMin: 0,
    priceMax: 10000,
    inStockOnly: false,
    featuredOnly: false,
    onOfferOnly: false,
    sortBy: 'newest',
  });

  // Pagination for 1000+ products scale
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
      setSlides(getStoredSlides());
      setOffers(getStoredOffers());
      setStoreInfo(getStoredStoreInfo());
      setHeroBackground(getStoredHeroBackground());
      setIsOwner(isOwnerAuthenticated());
    });
    return unsubscribe;
  }, []);

  // Cart Management
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Section Navigation Helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category Selection from category bar or footer
  const handleSelectCategory = (catId: string) => {
    setFilterState((prev) => ({ ...prev, category: catId }));
    setCurrentPage(1);
    scrollToSection('shop');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (filterState.category !== 'all' && p.category !== filterState.category) {
        return false;
      }
      // Search query
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      // Price filters
      const effectivePrice = p.offerPrice ?? p.price;
      if (effectivePrice < filterState.priceMin || effectivePrice > filterState.priceMax) {
        return false;
      }
      // In stock
      if (filterState.inStockOnly && p.stock <= 0) {
        return false;
      }
      // Featured
      if (filterState.featuredOnly && !p.isFeatured) {
        return false;
      }
      // On Offer
      if (filterState.onOfferOnly && (!p.offerPrice || p.offerPrice >= p.price)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.offerPrice ?? a.price;
      const priceB = b.offerPrice ?? b.price;

      if (filterState.sortBy === 'price-asc') return priceA - priceB;
      if (filterState.sortBy === 'price-desc') return priceB - priceA;
      if (filterState.sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (filterState.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, filterState]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Best Sellers and New Arrivals subsets for curated home highlights
  const bestSellers = useMemo(() => {
    return products.filter((p) => p.isBestSeller).slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNewArrival).slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen bg-[#08090b] text-stone-200 selection:bg-[#d4af37] selection:text-black">
      {/* 1. Ultra-Premium Glass Navbar */}
      <Navbar
        storeInfo={storeInfo}
        cartCount={totalCartCount}
        isOwner={isOwner}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => {
          if (isOwner) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* 2. 7-Page Manually Controlled Hero Slider */}
      <HeroSlider
        slides={slides}
        storeInfo={storeInfo}
        backgroundImage={heroBackground}
        onShopNow={() => scrollToSection('shop')}
        onExploreCategory={(cat) => handleSelectCategory(cat)}
        onExploreOffers={() => scrollToSection('offers')}
      />

      {/* 3. Premier Trust Announcement Strip - Clean, minimal, classic luxury */}
      <div className="bg-[#0A0A0A] border-y border-[#C9A227]/20 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-sans">
          <div className="flex items-center gap-2 text-[#A9A59C]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="font-cinzel text-xs tracking-wider uppercase font-semibold text-[#F3F0E8]">100% Genuine Premier Brands</span>
            <span className="text-[#C9A227]/30 hidden sm:inline">•</span>
            <span className="text-[#A9A59C] hidden sm:inline">Direct Importers</span>
          </div>

          <div className="flex items-center gap-2 text-[#A9A59C]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-cinzel text-xs tracking-wider uppercase font-semibold text-[#F3F0E8]">Direct Showroom Contact</span>
            <span className="text-[#C9A227]/30 hidden sm:inline">•</span>
            <a href={`tel:${storeInfo.phone}`} className="text-[#D6B85A] hover:text-[#F3F0E8] transition-colors hidden sm:inline font-mono">
              {storeInfo.phone}
            </a>
          </div>

          <div className="flex items-center gap-2 text-[#A9A59C]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="font-cinzel text-xs tracking-wider uppercase font-semibold text-[#F3F0E8]">Landmark at Bina Cinema</span>
            <span className="text-[#C9A227]/30 hidden sm:inline">•</span>
            <span className="text-[#A9A59C] hidden sm:inline">243, M.G. Road, Budge Budge</span>
          </div>
        </div>
      </div>

      {/* 4. Curated 10 Premier Boutiques Category Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={filterState.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* 5. Best Sellers Spotlight */}
      {bestSellers.length > 0 && (
        <section id="best-sellers-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-[#d4af37] uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Most Loved in Budge Budge</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Best Sellers & Iconic Essentials
              </h3>
            </div>
            <button
              onClick={() => {
                setFilterState((prev) => ({ ...prev, sortBy: 'best-selling', category: 'all' }));
                scrollToSection('shop');
              }}
              className="text-xs text-[#d4af37] hover:underline font-medium"
            >
              View All Best Sellers →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                isAddedToCart={cart.some((it) => it.product.id === prod.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Main Product Catalog & Filtering Section (1000+ Scale) */}
      <section id="shop-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-cinzel font-semibold tracking-wider mb-3">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Complete Commercial Catalog</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white mb-2">
            The Complete <span className="gold-gradient-text">Premier Boutique Collection</span>
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm font-light">
            Search, filter, and reserve directly from our 1000+ inventory with instant showroom pickup or Kolkata delivery.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) => {
                  setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }));
                  setCurrentPage(1);
                }}
                placeholder="Live Search products..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterState.category}
                onChange={(e) => {
                  setFilterState((prev) => ({ ...prev, category: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0e1015] border border-white/15 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
              >
                <option value="all">All 10 Boutiques ({products.length} Items)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0e1015] border border-white/15 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="best-selling">Sort: Best Selling</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
                <option value="rating">Sort: Highest Rated</option>
              </select>
            </div>

            {/* Quick Toggle Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilterState((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
                }
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  filterState.inStockOnly
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20'
                }`}
              >
                In Stock
              </button>

              <button
                onClick={() =>
                  setFilterState((prev) => ({ ...prev, featuredOnly: !prev.featuredOnly }))
                }
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  filterState.featuredOnly
                    ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/50'
                    : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20'
                }`}
              >
                Featured
              </button>

              <button
                onClick={() =>
                  setFilterState((prev) => ({ ...prev, onOfferOnly: !prev.onOfferOnly }))
                }
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  filterState.onOfferOnly
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20'
                }`}
              >
                Offers
              </button>
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-stone-400">
            <div>
              Showing <span className="text-white font-semibold">{filteredProducts.length}</span> of {products.length} products
              {filterState.category !== 'all' && (
                <span className="text-[#d4af37] ml-1.5 font-medium">
                  in {categories.find((c) => c.id === filterState.category)?.name}
                </span>
              )}
            </div>

            {(filterState.searchQuery ||
              filterState.category !== 'all' ||
              filterState.inStockOnly ||
              filterState.featuredOnly ||
              filterState.onOfferOnly) && (
              <button
                onClick={() => {
                  setFilterState({
                    searchQuery: '',
                    category: 'all',
                    priceMin: 0,
                    priceMax: 10000,
                    inStockOnly: false,
                    featuredOnly: false,
                    onOfferOnly: false,
                    sortBy: 'newest',
                  });
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 text-[#d4af37] hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-400 bg-white/5 rounded-3xl border border-white/10 p-8">
            <ShoppingBag className="w-12 h-12 text-[#d4af37] mx-auto mb-3 opacity-60" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-1">
              No matching products found
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Try adjusting your category or search query to explore our inventory.
            </p>
            <button
              onClick={() => {
                setFilterState({
                  searchQuery: '',
                  category: 'all',
                  priceMin: 0,
                  priceMax: 10000,
                  inStockOnly: false,
                  featuredOnly: false,
                  onOfferOnly: false,
                  sortBy: 'newest',
                });
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 rounded-full gold-gradient-bg text-black font-semibold text-xs"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                isAddedToCart={cart.some((it) => it.product.id === product.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: document.getElementById('shop-section')?.offsetTop ?? 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentPage(p);
                    window.scrollTo({ top: document.getElementById('shop-section')?.offsetTop ?? 0, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-mono font-medium transition-all ${
                    currentPage === p
                      ? 'bg-[#d4af37] text-black font-bold shadow-md'
                      : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: document.getElementById('shop-section')?.offsetTop ?? 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* 7. New Arrivals Spotlight */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Just Arrived in Budge Budge</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                New Arrivals & Limited Editions
              </h3>
            </div>
            <button
              onClick={() => {
                setFilterState((prev) => ({ ...prev, sortBy: 'newest', category: 'all' }));
                scrollToSection('shop');
              }}
              className="text-xs text-[#d4af37] hover:underline font-medium"
            >
              View All New Arrivals →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                isAddedToCart={cart.some((it) => it.product.id === prod.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Promotional Festival Offers Section */}
      <OffersSection
        offers={offers}
        storeInfo={storeInfo}
        onShopOfferCategory={(catTag) => {
          const match = categories.find((c) =>
            catTag.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(catTag.toLowerCase())
          );
          if (match) {
            handleSelectCategory(match.id);
          } else {
            scrollToSection('shop');
          }
        }}
      />

      {/* 9. Customer Reviews & Local Kolkata Trust */}
      <CustomerReviewsSection reviews={reviews} />

      {/* 10. Store Story & Showroom Gallery */}
      <AboutSection storeInfo={storeInfo} />

      {/* 11. Contact, Google Map & Store Visit */}
      <ContactSection storeInfo={storeInfo} />

      {/* 12. Elegant Footer */}
      <Footer
        storeInfo={storeInfo}
        categories={categories}
        onNavigate={scrollToSection}
        onSelectCategory={handleSelectCategory}
      />

      {/* Modals & Overlays */}
      {/* Product Details Modal with Multiple Images & Zoom */}
      <ProductModal
        product={selectedProduct}
        allProducts={products}
        storeInfo={storeInfo}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Shopping Bag Drawer with Direct Order */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        storeInfo={storeInfo}
      />

      {/* Quick Search Modal (Cmd/Ctrl + K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Owner Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsOwner(true);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Owner Panel (Admin Dashboard) */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        products={products}
        categories={categories}
        slides={slides}
        offers={offers}
        heroBackground={heroBackground}
        onDataChanged={() => {
          setProducts(getStoredProducts());
          setCategories(getStoredCategories());
          setSlides(getStoredSlides());
          setOffers(getStoredOffers());
          setHeroBackground(getStoredHeroBackground());
        }}
      />
    </div>
  );
}
