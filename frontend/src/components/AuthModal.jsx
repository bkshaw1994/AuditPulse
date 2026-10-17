import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  Building,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const { isOpen, mode: initialMode, title, subtitle, intent, onAuthenticated } = authModal;

  const [mode, setMode] = useState('signup'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'signup');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      let user;
      if (mode === 'signup') {
        user = await register({
          name,
          email,
          password,
          company,
          gstin
        });
        setSuccessMsg(`Welcome, ${user.name}! Your account has been created.`);
      } else {
        user = await login({ email, password });
        setSuccessMsg(`Welcome back, ${user.name || user.email}!`);
      }

      // If there's a pending callback (e.g. subscribe to Pro)
      if (typeof onAuthenticated === 'function') {
        setTimeout(() => {
          onAuthenticated(user);
          closeAuthModal();
        }, 400);
      } else {
        setTimeout(() => {
          closeAuthModal();
        }, 500);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const isProIntent = intent === 'pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pro Subscription Notice Banner */}
        {isProIntent && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-950">
                Account Required for Pro Subscription
              </p>
              <p className="text-[11px] text-indigo-700 leading-snug mt-0.5">
                Sign in or create your credentials to link your <strong>₹1,999/mo Pro Plan</strong>, 90-day retention & Slack alerts to your account.
              </p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title || (mode === 'signup' ? 'Create Your Account' : 'Sign In to AuditPulse')}
          </h2>
          <p className="text-xs text-slate-500">
            {subtitle || (mode === 'signup'
              ? 'Get started in 30 seconds. No credit card required for free features.'
              : 'Welcome back. Access your performance telemetry and monitored domains.')}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === 'login'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Work Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-400">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Labs India"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    GSTIN / Tax ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">18% ITC Invoice</span>
                </div>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AABCU9603R1ZM"
                    maxLength={15}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-hidden focus:border-indigo-600 transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? (isProIntent ? 'Create Account & Continue to Pro' : 'Create Free Account')
                    : (isProIntent ? 'Sign In & Continue to Pro' : 'Sign In')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Privacy Guarantee */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>256-bit encrypted • GDPR & Indian IT Act compliant</span>
        </div>
      </div>
    </div>
  );
}
