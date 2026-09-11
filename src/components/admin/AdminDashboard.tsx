import React, { useState, useRef } from 'react';
import {
  X,
  PlusCircle,
  Sliders,
  Tag,
  Package,
  Search,
  Trash2,
  Edit,
  Camera,
  Upload,
  Check,
  Sparkles,
  LogOut,
  AlertCircle,
  Download,
  RotateCcw,
  Eye,
  TrendingUp,
  Image as ImageIcon,
  Layers,
  Cloud,
  Database,
} from 'lucide-react';
import { Product, HeroSlide, Offer, Category } from '../../types';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductPrice,
  updateProductStock,
  updateSlide,
  updateOffer,
  addOffer,
  deleteOffer,
  fileToBase64,
  ownerLogout,
  exportCatalogJson,
  importCatalogJson,
  resetCatalogToDefault,
  getCloudSyncStatus,
} from '../../services/storageService';
import { images } from '../../config/images';
import { PhotoControlHub } from './PhotoControlHub';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  slides: HeroSlide[];
  offers: Offer[];
  heroBackground?: string;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  slides,
  offers,
  heroBackground,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'inventory' | 'add-product' | 'slides' | 'offers' | 'data'>('photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Edit product image states
  const [editingPhotoUrlInput, setEditingPhotoUrlInput] = useState('');
  const editProductFileInputRef = useRef<HTMLInputElement>(null);
  const editProductCameraInputRef = useRef<HTMLInputElement>(null);
  const tableProdFileInputRef = useRef<HTMLInputElement>(null);
  const [tableTargetProdId, setTableTargetProdId] = useState<string | null>(null);

  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.id || 'perfumes');
  const [newProductPrice, setNewProductPrice] = useState<number | ''>('');
  const [newProductOfferPrice, setNewProductOfferPrice] = useState<number | ''>('');
  const [newProductStock, setNewProductStock] = useState<number | ''>(15);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductFeatured, setNewProductFeatured] = useState(false);
  const [newProductImages, setNewProductImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Editing Slide State (1-7)
  const [selectedSlideNumber, setSelectedSlideNumber] = useState(1);
  const [slideEditNotice, setSlideEditNotice] = useState<string | null>(null);

  // Editing Offer State
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferSubtitle, setNewOfferSubtitle] = useState('');
  const [newOfferBadge, setNewOfferBadge] = useState('30% OFF');
  const [newOfferCode, setNewOfferCode] = useState('SPECIAL2026');
  const [newOfferImage, setNewOfferImage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Photo Upload from phone camera or file picker
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const base64List: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await fileToBase64(files[i]);
        base64List.push(base64);
      }
      setNewProductImages((prev) => [...prev, ...base64List]);
    } catch (err) {
      console.error('Failed to read image file:', err);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    setIsPublishing(true);
    setTimeout(() => {
      addProduct({
        name: newProductName,
        category: newProductCategory,
        price: Number(newProductPrice),
        offerPrice: newProductOfferPrice ? Number(newProductOfferPrice) : undefined,
        stock: Number(newProductStock) || 1,
        description: newProductDesc || 'Ultra-luxurious authentic item from Ishan Gift & Cosmetics, Budge Budge, Kolkata.',
        isFeatured: newProductFeatured,
        images: newProductImages.length > 0
          ? newProductImages
          : [images.defaultFallback],
      });

      setIsPublishing(false);
      setPublishSuccess(true);
      onDataChanged();

      // Reset form
      setNewProductName('');
      setNewProductPrice('');
      setNewProductOfferPrice('');
      setNewProductStock(15);
      setNewProductDesc('');
      setNewProductFeatured(false);
      setNewProductImages([]);

      setTimeout(() => setPublishSuccess(false), 3000);
      setActiveTab('inventory');
    }, 400);
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const base64 = await fileToBase64(files[0]);
      updateSlide(selectedSlideNumber, { image: base64 });
      setSlideEditNotice(`Slide ${selectedSlideNumber} image updated successfully!`);
      onDataChanged();
      setTimeout(() => setSlideEditNotice(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSlideChanges = (slide: HeroSlide) => {
    updateSlide(slide.pageNumber, slide);
    setSlideEditNotice(`Slide ${slide.pageNumber} details saved!`);
    onDataChanged();
    setTimeout(() => setSlideEditNotice(null), 2500);
  };

  const handleLogout = () => {
    ownerLogout();
    onClose();
  };

  // Filter products in inventory
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q))
    );
  });

  const currentSlideToEdit = slides.find((s) => s.pageNumber === selectedSlideNumber) || slides[0];

  const handleTablePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tableTargetProdId) return;
    try {
      const base64 = await fileToBase64(file);
      const prod = products.find((p) => p.id === tableTargetProdId);
      if (prod) {
        const otherImages = prod.images.filter((img) => img !== base64);
        updateProduct(prod.id, { images: [base64, ...otherImages] });
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTableTargetProdId(null);
    }
  };

  return (
    <div
      id="owner-dashboard-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-hidden animate-in fade-in duration-200"
    >
      <div className="w-full max-w-7xl mx-auto h-full bg-[#0d0e12] border border-[#d4af37]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-stone-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa8214] p-0.5 shadow-md">
              <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-[#d4af37]">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-white">
                  Owner Management Dashboard
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium">
                  <Cloud className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Cloud Backend Active &bull; Live to All Web Users</span>
                </div>
              </div>
              <p className="text-xs text-stone-400">
                Ishan Gift & Cosmetics • 243, MG Road, Budge Budge, Kolkata
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hidden File Input for Inventory Table Quick-Replace */}
        <input
          ref={tableProdFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleTablePhotoChange}
        />

        {/* Navigation Tabs */}
        <div className="px-4 py-2.5 bg-black/60 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'photos'
                ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>All Photos Control (Background, Slides, Catalog)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'add-product'
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Product (Camera Ready)</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'slides'
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>7-Page Hero Slider Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'offers'
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Manage Festival Offers</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'data'
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup / Import Data</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950/40">
          {/* TAB 0: ALL PHOTOS & VISUALS CONTROL (BACKGROUND, SLIDES, CATEGORIES, PRODUCTS) */}
          {activeTab === 'photos' && (
            <PhotoControlHub
              heroBackground={heroBackground || images.hero}
              slides={slides}
              categories={categories}
              products={products}
              onDataChanged={onDataChanged}
            />
          )}
          {/* TAB 1: INVENTORY TABLE */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, category..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[#0e1015] border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-semibold text-xs flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Upload Product</span>
                  </button>
                </div>
              </div>

              {/* Responsive Product Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d0e12]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Image</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price (₹)</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3 text-center">Featured</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-light">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <div className="relative group w-12 h-12 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setTableTargetProdId(prod.id);
                                  tableProdFileInputRef.current?.click();
                                }}
                                className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#d4af37]"
                                title="Click to upload new photo for this product"
                              >
                                <Camera className="w-4 h-4" />
                                <span className="text-[8px] font-mono text-white">Change</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-medium text-white line-clamp-1">{prod.name}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-amber-200/90 font-mono text-[10px] uppercase">
                              {prod.category.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                defaultValue={prod.offerPrice ?? prod.price}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (val > 0) updateProductPrice(prod.id, val);
                                }}
                                className="w-20 px-2 py-1 rounded bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-[#d4af37]"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              defaultValue={prod.stock}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val >= 0) updateProductStock(prod.id, val);
                              }}
                              className={`w-16 px-2 py-1 rounded bg-black/60 border font-mono text-xs ${
                                prod.stock <= 5
                                  ? 'border-amber-500/60 text-amber-300'
                                  : 'border-white/15 text-white'
                              }`}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={prod.isFeatured}
                              onChange={(e) => {
                                updateProduct(prod.id, { isFeatured: e.target.checked });
                                onDataChanged();
                              }}
                              className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setTableTargetProdId(prod.id);
                                  tableProdFileInputRef.current?.click();
                                }}
                                className="p-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#d4af37]"
                                title="Upload New Photo"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingProduct(prod)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                                title="Full Edit & Photos"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${prod.name}" permanently?`)) {
                                    deleteProduct(prod.id);
                                    onDataChanged();
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD PRODUCT (MOBILE PHOTO CAMERA UPLOAD READY) */}
          {activeTab === 'add-product' && (
            <div className="max-w-3xl mx-auto bg-[#0e1015] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    Add New Product to Store
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium">
                    <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cloud Backend Live Storage</span>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Upload item photos and name directly via your phone camera or computer. Saved to the cloud backend server and instantly shown to all web users in real-time!
                </p>
              </div>

              {publishSuccess && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Product published successfully! Now live for all shoppers.</span>
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="space-y-5">
                {/* Photo Upload Area */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-2">
                    Product Photos (Camera or Gallery)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {/* Camera Capture on Phone */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="h-28 rounded-2xl border-2 border-dashed border-[#d4af37]/40 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 flex flex-col items-center justify-center p-2 text-center transition-colors"
                    >
                      <Camera className="w-6 h-6 text-[#d4af37] mb-1" />
                      <span className="text-xs font-semibold text-white">Take Photo</span>
                      <span className="text-[10px] text-stone-400">Mobile Camera</span>
                    </button>

                    {/* File Picker */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-28 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center p-2 text-center transition-colors"
                    >
                      <Upload className="w-6 h-6 text-stone-300 mb-1" />
                      <span className="text-xs font-semibold text-white">Select File</span>
                      <span className="text-[10px] text-stone-400">Computer / Photos</span>
                    </button>

                    {/* Uploaded Previews */}
                    {newProductImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-28 rounded-2xl overflow-hidden border border-white/15 bg-stone-900 group"
                      >
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewProductImages((p) => p.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Hidden inputs for camera capture & files */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Royal Oud Al-Habib 100ml"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e1015] border border-white/15 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="2499"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Offer Price (₹, Optional)
                    </label>
                    <input
                      type="number"
                      value={newProductOfferPrice}
                      onChange={(e) => setNewProductOfferPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="1999"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Stock Quantity in Store *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProductFeatured}
                        onChange={(e) => setNewProductFeatured(e.target.checked)}
                        className="accent-[#d4af37] w-4 h-4"
                      />
                      <span className="text-xs text-stone-200 font-medium">
                        Highlight as Featured Product
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    placeholder="Enter scent notes, material, skin types, bridal details..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-sm shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing Product...' : 'Publish Product Instantly'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: 7-PAGE HERO SLIDER UPLOAD & MANAGEMENT */}
          {activeTab === 'slides' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  7-Page Manual Homepage Slider Management
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Upload custom photos and edit banners for all 7 slides directly from your phone or PC.
                </p>
              </div>

              {slideEditNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{slideEditNotice}</span>
                </div>
              )}

              {/* Slide Number Tabs (1 to 7) */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedSlideNumber(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSlideNumber === num
                        ? 'bg-[#d4af37] text-black shadow-md'
                        : 'bg-white/5 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    Slide {num}
                  </button>
                ))}
              </div>

              {/* Current Slide Editor Card */}
              {currentSlideToEdit && (
                <div className="bg-[#0e1015] border border-white/10 rounded-3xl p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Slide Photo Preview & Replace */}
                    <div className="w-full sm:w-1/2 space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-stone-900 shadow-md">
                        <img
                          src={currentSlideToEdit.image}
                          alt={currentSlideToEdit.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#d4af37]">
                          Slide #{currentSlideToEdit.pageNumber} of 7
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => slideFileInputRef.current?.click()}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 border border-white/15 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Upload New Slide Photo</span>
                        </button>
                        <input
                          ref={slideFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSlideImageUpload}
                        />
                      </div>
                    </div>

                    {/* Text Details for Slide */}
                    <div className="w-full sm:w-1/2 space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-400 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          defaultValue={currentSlideToEdit.badgeText}
                          onBlur={(e) =>
                            handleSaveSlideChanges({ ...currentSlideToEdit, badgeText: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-400 mb-1">
                          Slide Main Title
                        </label>
                        <input
                          type="text"
                          defaultValue={currentSlideToEdit.title}
                          onBlur={(e) =>
                            handleSaveSlideChanges({ ...currentSlideToEdit, title: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-400 mb-1">
                          Subtitle Description
                        </label>
                        <textarea
                          rows={2}
                          defaultValue={currentSlideToEdit.subtitle}
                          onBlur={(e) =>
                            handleSaveSlideChanges({ ...currentSlideToEdit, subtitle: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OFFERS MANAGEMENT */}
          {activeTab === 'offers' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Promotional Offers Management
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Update Durga Puja, Diwali, Valentine’s, or Bridal offers without touching code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="bg-[#0e1015] border border-white/15 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-cinzel">
                        {off.title}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this offer banner?')) {
                            deleteOffer(off.id);
                            onDataChanged();
                          }
                        }}
                        className="text-stone-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-mono">
                        Discount Badge
                      </label>
                      <input
                        type="text"
                        defaultValue={off.discountBadge}
                        onBlur={(e) => updateOffer(off.id, { discountBadge: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 uppercase font-mono">
                        Offer Subtitle
                      </label>
                      <textarea
                        rows={2}
                        defaultValue={off.subtitle}
                        onBlur={(e) => updateOffer(off.id, { subtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 uppercase font-mono">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          defaultValue={off.code}
                          onBlur={(e) => updateOffer(off.id, { code: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 uppercase font-mono">
                          Valid Until
                        </label>
                        <input
                          type="text"
                          defaultValue={off.validUntil}
                          onBlur={(e) => updateOffer(off.id, { validUntil: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DATA BACKUP & RESTORE */}
          {activeTab === 'data' && (
            <div className="max-w-xl mx-auto bg-[#0e1015] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Data Backup & Catalog Security
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Safeguard your complete catalog of 1000+ products, slides, and festival offers.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    const json = exportCatalogJson();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ishan-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#d4af37]" />
                  <span>Export Catalog Backup (JSON)</span>
                </button>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-xs font-medium text-stone-300 mb-2">
                    Import Catalog JSON
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content && importCatalogJson(content)) {
                          alert('Catalog imported successfully!');
                          onDataChanged();
                        } else {
                          alert('Invalid JSON catalog file.');
                        }
                      };
                      reader.readAsText(file);
                    }}
                    className="text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-black hover:file:brightness-110"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all catalog data to initial default demo items?')) {
                        resetCatalogToDefault();
                        onDataChanged();
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Catalog to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-950 border-t border-white/10 text-center text-xs text-stone-400 flex items-center justify-between px-6">
          <span className="font-mono text-[11px] text-stone-400">
            Authenticated as: Ishanstores09@gmail.com
          </span>
          <span className="text-[11px] text-[#d4af37]">
            243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137
          </span>
        </div>
      </div>

      {/* Edit Product Sub-Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0e1015] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-white">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.offerPrice ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        offerPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1015] border border-white/10 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              {/* Product Photos Control Section */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-stone-200 font-semibold block text-xs">
                    Product Photos ({editingProduct.images.length})
                  </label>
                  <span className="text-[10px] text-stone-400">First photo is cover image</span>
                </div>

                {/* Hidden File & Camera Inputs */}
                <input
                  ref={editProductFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const base64 = await fileToBase64(file);
                      setEditingProduct({
                        ...editingProduct,
                        images: [base64, ...editingProduct.images],
                      });
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
                <input
                  ref={editProductCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const base64 = await fileToBase64(file);
                      setEditingProduct({
                        ...editingProduct,
                        images: [base64, ...editingProduct.images],
                      });
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />

                {/* Images Gallery */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {editingProduct.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl overflow-hidden border bg-stone-900 group ${
                        idx === 0 ? 'border-[#d4af37] ring-1 ring-[#d4af37]' : 'border-white/15'
                      }`}
                    >
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#d4af37]">
                          Cover
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const reordered = [
                                img,
                                ...editingProduct.images.filter((_, i) => i !== idx),
                              ];
                              setEditingProduct({ ...editingProduct, images: reordered });
                            }}
                            className="px-2 py-0.5 rounded bg-[#d4af37] text-black text-[9px] font-bold"
                            title="Make Cover"
                          >
                            Set Cover
                          </button>
                        )}
                        {editingProduct.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct({
                                ...editingProduct,
                                images: editingProduct.images.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-1 rounded bg-red-600 text-white"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Buttons & URL Input */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => editProductFileInputRef.current?.click()}
                    className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-[11px] font-medium flex items-center justify-center gap-1.5 border border-white/15 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload New Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => editProductCameraInputRef.current?.click()}
                    className="py-2 px-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] text-[11px] font-medium flex items-center justify-center gap-1.5 border border-[#d4af37]/30 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Camera Photo</span>
                  </button>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste photo URL..."
                    value={editingPhotoUrlInput}
                    onChange={(e) => setEditingPhotoUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingPhotoUrlInput.trim()) return;
                      setEditingProduct({
                        ...editingProduct,
                        images: [editingPhotoUrlInput.trim(), ...editingProduct.images],
                      });
                      setEditingPhotoUrlInput('');
                    }}
                    disabled={!editingPhotoUrlInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-[#d4af37] disabled:opacity-40 text-black font-semibold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateProduct(editingProduct.id, editingProduct);
                  setEditingProduct(null);
                  onDataChanged();
                }}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-black font-semibold text-xs shadow-md mt-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
