import React, { useState } from 'react';
import { Lock, Mail, Key, X, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { ownerLogin, OWNER_CREDENTIALS } from '../../services/storageService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = ownerLogin(email, password);
      setIsLoading(false);
      if (success) {
        onLoginSuccess();
        onClose();
      } else {
        setError('Invalid owner credentials. Please verify your email and password.');
      }
    }, 400);
  };

  const handleFillCredentials = () => {
    setEmail(OWNER_CREDENTIALS.email);
    setPassword(OWNER_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div
      id="owner-login-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0e1015] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-white tracking-wide">
            Owner Portal Login
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Ishan Gift & Cosmetics Store Administration
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Owner Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ishanstores09@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs sm:text-sm shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Access Dashboard'}</span>
          </button>
        </form>

        {/* Quick Credentials Helper Button */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleFillCredentials}
            className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-fill Owner Credentials</span>
          </button>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">
            Email: Ishanstores09@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};
