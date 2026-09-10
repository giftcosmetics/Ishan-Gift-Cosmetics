import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, Phone, MapPin, ChevronLeft } from 'lucide-react';
import { CartItem, StoreInfo } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  storeInfo: StoreInfo;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  storeInfo,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'counter'>('counter');
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    const price = item.product.offerPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const orderId = `IGH-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlacedOrderId(orderId);
    setStep('confirmed');
    onClearCart();
  };

  const handleFinish = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#0d0e12] border-l border-[#d4af37]/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' ? (
              <button
                onClick={() => setStep('cart')}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 mr-1 transition-colors"
                title="Back to Bag"
              >
                <ChevronLeft className="w-5 h-5 text-[#d4af37]" />
              </button>
            ) : null}
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-white tracking-wide">
                {step === 'confirmed' ? 'Order Confirmed' : step === 'checkout' ? 'Complete Order' : 'Shopping Bag'}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">
                {step === 'confirmed'
                  ? `Order #${placedOrderId}`
                  : `${items.length} ${items.length === 1 ? 'item' : 'items'} selected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {step === 'cart' && items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-stone-400 hover:text-red-400 px-2 py-1 transition-colors"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body based on step */}
        {step === 'confirmed' ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-cinzel text-xl font-bold text-white mb-1">Thank You!</h4>
            <p className="text-[#d4af37] font-mono text-xs font-semibold mb-3">Order #{placedOrderId}</p>
            <p className="text-stone-300 text-xs sm:text-sm font-light max-w-xs mb-6 leading-relaxed">
              Your order has been registered with our store concierge. Our team is preparing your items at our Budge Budge showroom.
            </p>

            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs text-stone-300">
              <div className="flex items-center gap-2 text-white font-semibold pb-2 border-b border-white/10">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Showroom Location</span>
              </div>
              <p className="text-stone-300 leading-relaxed font-light">
                243, M.G. Road (Opposite Bina Cinema), Budge Budge, Kolkata - 700137
              </p>
              <div className="pt-2 flex items-center gap-2 text-amber-300">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${storeInfo.phone}`} className="hover:underline font-mono text-xs">
                  {storeInfo.phone}
                </a>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110"
            >
              Done &amp; Continue Shopping
            </button>
          </div>
        ) : step === 'checkout' ? (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-2">
              <div className="text-xs text-stone-400 mb-1">Order Summary:</div>
              <div className="flex justify-between items-center text-sm font-bold text-white font-cinzel">
                <span>Total Amount:</span>
                <span className="text-[#d4af37]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Mukherjee"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#050608] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98300 00000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#050608] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Fulfillment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                      fulfillmentType === 'pickup'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-white/5 border-white/10 text-stone-400'
                    }`}
                  >
                    🏪 Store Pickup (Bina Cinema)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                      fulfillmentType === 'delivery'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-white/5 border-white/10 text-stone-400'
                    }`}
                  >
                    🚚 Local Delivery
                  </button>
                </div>
              </div>

              {fulfillmentType === 'delivery' && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Delivery Address *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Street, Landmark, Budge Budge / Kolkata"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#050608] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('counter')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                      paymentMethod === 'counter'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-white/5 border-white/10 text-stone-400'
                    }`}
                  >
                    Pay at Store Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                      paymentMethod === 'cod'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-white/5 border-white/10 text-stone-400'
                    }`}
                  >
                    Cash / UPI on Delivery
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm &amp; Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Cart items list */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#d4af37]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-cinzel text-base font-semibold text-stone-200 mb-1">
                  Your Shopping Bag is Empty
                </h4>
                <p className="text-xs text-stone-400 max-w-xs mb-6 font-light">
                  Discover our perfumes, makeup, bridal jewelry, and curated gift hampers.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full gold-gradient-bg text-black font-semibold text-xs shadow-lg shadow-[#d4af37]/20"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = item.product.offerPrice ?? item.product.price;
                const lineTotal = unitPrice * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-3 items-center group hover:border-[#d4af37]/40 transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-900 border border-white/10"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate group-hover:text-[#d4af37] transition-colors">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-stone-400 font-mono mb-2">
                        ₹{unitPrice.toLocaleString('en-IN')} each
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-black/50 border border-white/15 rounded-lg overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="px-2 py-0.5 text-xs text-stone-300 hover:text-white hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-white font-mono min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="px-2 py-0.5 text-xs text-stone-300 hover:text-white hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-xs font-bold text-[#d4af37]">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer Summary & Order CTA when on 'cart' step */}
        {step === 'cart' && items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-stone-950 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Pickup / Delivery</span>
                <span className="text-emerald-400">Showroom Pickup or Fast Delivery</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span className="font-cinzel">Total Estimate</span>
                <span className="font-cinzel text-base text-[#d4af37]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Direct Checkout / Order Button */}
            <button
              id="cart-checkout-btn"
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 px-4 rounded-xl gold-gradient-bg text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center font-light">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Showroom at 243, M.G. Road (Opposite Bina Cinema), Budge Budge</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
