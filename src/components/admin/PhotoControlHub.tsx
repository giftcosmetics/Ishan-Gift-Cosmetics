import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Check,
  Search,
  Sliders,
  Package,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Cloud,
} from 'lucide-react';
import { Category, HeroSlide, Product } from '../../types';
import {
  saveHeroBackground,
  resetHeroBackground,
  updateSlide,
  updateCategory,
  updateProduct,
  fileToBase64,
  compressImageFile,
  resetSlidesToDefault,
  getStoredStoreInfo,
  saveStoreLogo,
  resetStoreLogo,
} from '../../services/storageService';
import { images } from '../../config/images';

interface PhotoControlHubProps {
  heroBackground: string;
  slides: HeroSlide[];
  categories: Category[];
  products: Product[];
  onDataChanged: () => void;
}

export const PhotoControlHub: React.FC<PhotoControlHubProps> = ({
  heroBackground,
  slides,
  categories,
  products,
  onDataChanged,
}) => {
  const [subTab, setSubTab] = useState<'logo' | 'background' | 'slides' | 'categories' | 'products'>('logo');

  // Logo state
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoNotice, setLogoNotice] = useState<string | null>(null);
  const [isLogoError, setIsLogoError] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const currentStoreInfo = getStoredStoreInfo();

  // Background state
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [bgNotice, setBgNotice] = useState<string | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const bgCameraInputRef = useRef<HTMLInputElement>(null);

  // Slides state
  const [selectedSlideNum, setSelectedSlideNum] = useState<number>(1);
  const [slideUrlInput, setSlideUrlInput] = useState('');
  const [slideNotice, setSlideNotice] = useState<string | null>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const slideCameraInputRef = useRef<HTMLInputElement>(null);

  // Category state
  const [catSearch, setCatSearch] = useState('');
  const [categoryNotice, setCategoryNotice] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catUrlInput, setCatUrlInput] = useState('');
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // Product Catalog search state
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCat, setProductFilterCat] = useState('all');
  const [productNotice, setProductNotice] = useState<string | null>(null);
  const [activeProductIdForUpload, setActiveProductIdForUpload] = useState<string | null>(null);
  const prodFileInputRef = useRef<HTMLInputElement>(null);
  const prodCameraInputRef = useRef<HTMLInputElement>(null);

  // 0. LOGO HANDLERS
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, 400, 400, 0.9);
      saveStoreLogo(base64);
      setIsLogoError(false);
      setLogoNotice('Brand logo updated and saved permanently!');
      onDataChanged();
      setTimeout(() => setLogoNotice(null), 3500);
    } catch (err) {
      console.error('Failed to process logo file:', err);
    }
  };

  const handleApplyLogoUrl = () => {
    if (!logoUrlInput.trim()) return;
    saveStoreLogo(logoUrlInput.trim());
    setIsLogoError(false);
    setLogoNotice('Brand logo URL updated successfully!');
    setLogoUrlInput('');
    onDataChanged();
    setTimeout(() => setLogoNotice(null), 3500);
  };

  const handleResetLogo = () => {
    resetStoreLogo();
    setIsLogoError(false);
    setLogoNotice('Brand logo reset to default royal monogram.');
    onDataChanged();
    setTimeout(() => setLogoNotice(null), 3500);
  };

  // 1. BACKGROUND HANDLERS
  const handleBgFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      saveHeroBackground(base64);
      setBgNotice('Hero background image updated successfully!');
      onDataChanged();
      setTimeout(() => setBgNotice(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyBgUrl = () => {
    if (!bgUrlInput.trim()) return;
    saveHeroBackground(bgUrlInput.trim());
    setBgNotice('Hero background image URL applied successfully!');
    setBgUrlInput('');
    onDataChanged();
    setTimeout(() => setBgNotice(null), 3500);
  };

  const handleResetBg = () => {
    resetHeroBackground();
    setBgNotice('Reset to default Royal Deer Heritage gold background!');
    onDataChanged();
    setTimeout(() => setBgNotice(null), 3500);
  };

  // 2. SLIDES HANDLERS
  const currentSlide = slides.find((s) => s.pageNumber === selectedSlideNum) || slides[0];

  const handleSlideFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlide) return;
    try {
      const base64 = await fileToBase64(file);
      updateSlide(currentSlide.pageNumber, { image: base64 });
      setSlideNotice(`Slide #${currentSlide.pageNumber} photo replaced successfully!`);
      onDataChanged();
      setTimeout(() => setSlideNotice(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplySlideUrl = () => {
    if (!slideUrlInput.trim() || !currentSlide) return;
    updateSlide(currentSlide.pageNumber, { image: slideUrlInput.trim() });
    setSlideNotice(`Slide #${currentSlide.pageNumber} photo updated with custom URL!`);
    setSlideUrlInput('');
    onDataChanged();
    setTimeout(() => setSlideNotice(null), 3500);
  };

  // 3. CATEGORY HANDLERS
  const handleCategoryFileChange = async (catId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      updateCategory(catId, { image: base64 });
      const name = categories.find((c) => c.id === catId)?.name || 'Category';
      setCategoryNotice(`Category "${name}" image updated successfully!`);
      onDataChanged();
      setTimeout(() => setCategoryNotice(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyCategoryUrl = (catId: string) => {
    if (!catUrlInput.trim()) return;
    updateCategory(catId, { image: catUrlInput.trim() });
    const name = categories.find((c) => c.id === catId)?.name || 'Category';
    setCategoryNotice(`Category "${name}" image updated with custom URL!`);
    setCatUrlInput('');
    setEditingCatId(null);
    onDataChanged();
    setTimeout(() => setCategoryNotice(null), 3500);
  };

  // 4. PRODUCT PHOTO HANDLERS
  const handleProductFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProductIdForUpload) return;
    try {
      const base64 = await fileToBase64(file);
      const prod = products.find((p) => p.id === activeProductIdForUpload);
      if (prod) {
        const otherImages = prod.images.filter((img) => img !== base64);
        const updatedImages = [base64, ...otherImages];
        updateProduct(prod.id, { images: updatedImages });
        setProductNotice(`Catalog photo updated for "${prod.name}"!`);
        onDataChanged();
        setTimeout(() => setProductNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveProductIdForUpload(null);
    }
  };

  // Filtered products for photo replacement
  const filteredProducts = products.filter((p) => {
    const matchesCat = productFilterCat === 'all' || p.category === productFilterCat;
    const q = productSearch.trim().toLowerCase();
    if (!q) return matchesCat;
    return matchesCat && (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const filteredCategories = categories.filter((c) => {
    const q = catSearch.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-[#13110e] to-stone-900 border border-[#d4af37]/35 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[11px] font-mono text-[#d4af37] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              Owner Visual Studio &amp; Photos Control
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              Change All Images &amp; Visuals
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Full control over Brand Logo, Hero Background, 7 Homepage Slides, 10 Catalog Categories, and all Product Photos. Stored on Cloud Server &amp; visible to all web users.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-emerald-400" />
              Cloud Synced
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-stone-300">
              {products.length} Products
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-stone-300">
              7 Hero Slides
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-stone-300">
              10 Categories
            </span>
          </div>
        </div>

        {/* Sub Navigation Pills */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          <button
            onClick={() => setSubTab('logo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'logo'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-102'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Logo & Brand Mark</span>
          </button>

          <button
            onClick={() => setSubTab('background')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'background'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-102'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>1. Hero Background Image</span>
          </button>

          <button
            onClick={() => setSubTab('slides')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'slides'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-102'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Slide Page Images (1 to 7)</span>
          </button>

          <button
            onClick={() => setSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'categories'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-102'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Product Catalog Categories (10)</span>
          </button>

          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'products'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-102'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>4. Product Catalog Images</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 0. BRAND LOGO & EMBLEM SECTION */}
      {/* ============================================================ */}
      {subTab === 'logo' && (
        <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                Store Brand Logo & Circular Emblem
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Displays in the royal gold medallion on the header navigation bar, mobile menu, and footer.
              </p>
            </div>
            <button
              onClick={handleResetLogo}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Reset to Royal Monogram</span>
            </button>
          </div>

          {logoNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{logoNotice}</span>
            </div>
          )}

          {/* Live Preview Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Medallion Preview */}
            <div className="p-6 rounded-2xl bg-[#08090b] border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-xs text-stone-400 font-medium">Live Header Navbar Preview</div>
              
              <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-[#121110] border border-[#C9A227]/30 shadow-xl">
                <div className="w-12 h-12 rounded-full border border-[#C9A227]/60 p-0.5 flex items-center justify-center bg-[#121110] overflow-hidden shrink-0 shadow-lg shadow-[#C9A227]/10">
                  {currentStoreInfo.logo && !isLogoError ? (
                    <img
                      src={currentStoreInfo.logo}
                      alt={currentStoreInfo.name}
                      referrerPolicy="no-referrer"
                      onError={() => setIsLogoError(true)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border border-[#C9A227]/25 flex items-center justify-center bg-[#0D0C0A]">
                      <span className="font-cinzel text-sm font-semibold text-[#D6B85A] tracking-[0.14em]">
                        IGC
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-cinzel text-sm font-bold text-[#F3F0E8] tracking-wider">
                    ISHAN <span className="text-[#C9A227]">GIFT &amp; COSMETICS</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-[#A9A59C]">
                    Premier Boutique • Budge Budge
                  </div>
                </div>
              </div>

              {isLogoError && (
                <div className="flex items-center gap-1.5 text-amber-400/90 text-xs text-left max-w-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>The custom link requires an active ChatGPT browser session. Use the upload button to select the logo file directly from your device for permanent display.</span>
                </div>
              )}
            </div>

            {/* Upload & Replace Controls */}
            <div className="space-y-4">
              {/* Option A: Direct File Upload */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <span>Upload Logo Image from Phone or PC</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Select your logo image file (PNG, JPG, SVG, or WebP). Automatically compressed and saved permanently for ultra-fast instant loading.
                </p>

                <input
                  type="file"
                  ref={logoFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFileChange}
                />

                <button
                  onClick={() => logoFileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] hover:brightness-110 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Logo File / Photo</span>
                </button>
              </div>

              {/* Option B: Direct Image URL or Path */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                  <span>Or Set Image URL</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    onClick={handleApplyLogoUrl}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HERO BACKGROUND IMAGE SECTION */}
      {/* ============================================================ */}
      {subTab === 'background' && (
        <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#d4af37]" />
                Website Hero Background Backdrop
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                This image is the grand, atmospheric background rendered behind the store header and hero slider.
              </p>
            </div>
            <button
              onClick={handleResetBg}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Reset to Royal Deer Default</span>
            </button>
          </div>

          {bgNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bgNotice}</span>
            </div>
          )}

          {/* Current Live Preview Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-medium text-stone-300">Live Background Preview</span>
              <span className="text-[11px] font-mono text-[#d4af37]">Full Website Cover</span>
            </div>

            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-black shadow-2xl">
              <img
                src={heroBackground || images.hero}
                alt="Current Hero Background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />

              {/* Mock Overlay of Header Elements */}
              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                    Live Display Simulation
                  </div>
                  <div className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider">
                    ISHAN GIFT &amp; COSMETICS
                  </div>
                  <div className="text-xs text-stone-300 italic font-serif">
                    Fine Beauty, Imported Fragrances &amp; Curated Keepsakes
                  </div>
                </div>
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 self-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Background
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Upload, Camera, URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Direct Upload Buttons */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-semibold text-white block">
                Option A: Upload Photo from Phone or PC
              </span>
              <p className="text-[11px] text-stone-400">
                Choose any high-resolution photo from your gallery or capture directly using your camera.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => bgFileInputRef.current?.click()}
                  className="py-3 px-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo File</span>
                </button>
                <input
                  ref={bgFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBgFileChange}
                />

                <button
                  type="button"
                  onClick={() => bgCameraInputRef.current?.click()}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 border border-white/20 transition-all"
                >
                  <Camera className="w-4 h-4 text-[#d4af37]" />
                  <span>Take with Camera</span>
                </button>
                <input
                  ref={bgCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleBgFileChange}
                />
              </div>
            </div>

            {/* Direct URL Input */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-semibold text-white block">
                Option B: Paste Online Image Web Link (URL)
              </span>
              <p className="text-[11px] text-stone-400">
                Paste any web link or image hosting URL to set as the background immediately.
              </p>

              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bgUrlInput}
                  onChange={(e) => setBgUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleApplyBgUrl}
                  disabled={!bgUrlInput.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#d4af37] disabled:opacity-50 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-opacity"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Web Image URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SLIDE PAGE IMAGES (1 to 7) */}
      {/* ============================================================ */}
      {subTab === 'slides' && (
        <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#d4af37]" />
                7-Page Hero Slide Carousel Images
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Every slide page in the top carousel can have its custom high-resolution photo replaced anytime.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all 7 slides back to default luxury catalog images?')) {
                  resetSlidesToDefault();
                  onDataChanged();
                }
              }}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center gap-1.5 border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Reset All 7 Slides</span>
            </button>
          </div>

          {slideNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{slideNotice}</span>
            </div>
          )}

          {/* Quick Page Selector Pill Buttons */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setSelectedSlideNum(num);
                  setSlideUrlInput('');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedSlideNum === num
                    ? 'bg-[#d4af37] text-black shadow-md scale-102'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                Page {num}
              </button>
            ))}
          </div>

          {/* Selected Slide Detail & Photo Replacer */}
          {currentSlide && (
            <div className="bg-stone-950 border border-white/10 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Photo Preview */}
                <div className="w-full lg:w-1/2 space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-stone-900 shadow-xl">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono text-[#d4af37] border border-white/15">
                      Slide Page #{currentSlide.pageNumber} of 7
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs text-white">
                      <div className="font-semibold line-clamp-1">{currentSlide.title}</div>
                      <div className="text-[11px] text-stone-400 line-clamp-1">{currentSlide.subtitle}</div>
                    </div>
                  </div>
                </div>

                {/* Upload / Replace Actions for Selected Slide */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-white">
                      Replace Photo for Slide {currentSlide.pageNumber}: {currentSlide.title}
                    </h5>
                    <p className="text-xs text-stone-400 mt-1">
                      Choose an image from your device, take a live camera shot, or enter an image URL.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => slideFileInputRef.current?.click()}
                      className="py-3 px-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo File</span>
                    </button>
                    <input
                      ref={slideFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSlideFileChange}
                    />

                    <button
                      type="button"
                      onClick={() => slideCameraInputRef.current?.click()}
                      className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 border border-white/20 transition-all"
                    >
                      <Camera className="w-4 h-4 text-[#d4af37]" />
                      <span>Take Photo (Camera)</span>
                    </button>
                    <input
                      ref={slideCameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleSlideFileChange}
                    />
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <label className="text-[11px] font-medium text-stone-300 block">
                      Or Paste Image Web Link (URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={slideUrlInput}
                        onChange={(e) => setSlideUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                      <button
                        type="button"
                        onClick={handleApplySlideUrl}
                        disabled={!slideUrlInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#d4af37] disabled:opacity-40 text-black font-semibold text-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mini Grid of All 7 Slides for Instant Visual Overview */}
          <div>
            <span className="text-xs font-semibold text-stone-300 mb-2.5 block">
              All 7 Slides Overview (Click to Edit)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {slides.slice(0, 7).map((s) => (
                <div
                  key={s.pageNumber}
                  onClick={() => setSelectedSlideNum(s.pageNumber)}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-[4/3] bg-stone-900 ${
                    selectedSlideNum === s.pageNumber
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/50 scale-102 shadow-lg'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#d4af37]">
                    #{s.pageNumber}
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate">
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. PRODUCT CATALOG CATEGORY IMAGES (10 CATEGORIES) */}
      {/* ============================================================ */}
      {subTab === 'categories' && (
        <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#d4af37]" />
                10 Product Catalog Category Images
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Change the banner image shown for each boutique department in the category navigation bar.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search category..."
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {categoryNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{categoryNotice}</span>
            </div>
          )}

          {/* Grid of 10 Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const productCount = products.filter((p) => p.category === cat.id).length;
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="bg-stone-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#d4af37]/40 transition-colors shadow-md"
                >
                  <div className="space-y-2">
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/15 bg-stone-900 group">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-xs font-bold font-cinzel tracking-wider text-amber-200">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-[#d4af37]">
                          {productCount} items
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-400 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Actions for this category */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex gap-2">
                      <label className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-white/15 transition-colors">
                        <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCategoryFileChange(cat.id, e)}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(isEditing ? null : cat.id);
                          setCatUrlInput('');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                          isEditing
                            ? 'bg-[#d4af37] text-black font-semibold'
                            : 'bg-white/5 hover:bg-white/10 text-stone-300'
                        }`}
                        title="Paste Web URL"
                      >
                        URL
                      </button>
                    </div>

                    {isEditing && (
                      <div className="space-y-2 pt-2 bg-black/40 p-2.5 rounded-xl border border-white/10 animate-in fade-in">
                        <label className="text-[10px] text-stone-400 block font-medium">
                          Paste Image URL for {cat.name}:
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={catUrlInput}
                            onChange={(e) => setCatUrlInput(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCategoryUrl(cat.id)}
                            disabled={!catUrlInput.trim()}
                            className="px-3 py-1.5 rounded-lg bg-[#d4af37] disabled:opacity-40 text-black font-bold text-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. PRODUCT CATALOG IMAGES (CHANGE ANY PRODUCT IMAGE) */}
      {/* ============================================================ */}
      {subTab === 'products' && (
        <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#d4af37]" />
                Product Catalog Photo Replacer
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Quickly search any product in the entire boutique and replace its display photo with 1 click.
              </p>
            </div>

            {/* Hidden file input for single product upload */}
            <input
              ref={prodFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProductFileChange}
            />
            <input
              ref={prodCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleProductFileChange}
            />
          </div>

          {productNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{productNotice}</span>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, perfume brand, jewelry style..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <select
              value={productFilterCat}
              onChange={(e) => setProductFilterCat(e.target.value)}
              className="bg-[#0e1015] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-stone-300 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">All Departments ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-stone-950 border border-white/10 rounded-2xl p-3 flex flex-col justify-between space-y-3 hover:border-[#d4af37]/40 transition-colors shadow-sm"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-stone-900 mb-2.5 group">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-amber-300 uppercase">
                      {prod.category.replace('-', ' ')}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs font-mono font-bold text-white">
                      ₹{prod.offerPrice ?? prod.price}
                    </div>
                  </div>

                  <h5 className="text-xs font-semibold text-white line-clamp-1">
                    {prod.name}
                  </h5>
                  <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                    {prod.description}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProductIdForUpload(prod.id);
                      prodFileInputRef.current?.click();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-[11px] font-medium flex items-center justify-center gap-1 border border-white/15 transition-colors"
                    title="Upload image file"
                  >
                    <Upload className="w-3 h-3 text-[#d4af37]" />
                    <span>Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveProductIdForUpload(prod.id);
                      prodCameraInputRef.current?.click();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] text-[11px] font-medium flex items-center justify-center gap-1 border border-[#d4af37]/30 transition-colors"
                    title="Capture live photo"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
