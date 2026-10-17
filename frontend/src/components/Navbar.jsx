import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Printer, FileSpreadsheet, Home, Sparkles, Terminal, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentAudit, isConnected, onExportJson, onPrintReport, onExportCsv, onOpenPricing, flags = {} }) {
  const { user, isAuthenticated, logout, openAuthModal, requireAuth } = useAuth();
  const showMonetization = flags.monetizationEnabled || flags.showPricingFeature;

  const handleUpgradeClick = () => {
    // Show package details first so user can review and select options
    onOpenPricing();
  };

  return (
    <header className="h-16 bg-white/90 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl shadow-sm">
      
      {/* Target URL Info & Home Navigation */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-mono font-medium transition-colors shadow-sm"
          title="Return to SaaS Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-indigo-600" />
          <span>Landing Page</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-200" />

        {currentAudit ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">
              Target URL:
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              {currentAudit.url}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Ready — Enter URL above to audit</span>
          </div>
        )}
      </div>

      {/* Action Controls & Health Status */}
      <div className="flex items-center gap-3">
        {showMonetization && (
          <button
            onClick={handleUpgradeClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{user?.isPro ? 'Pro Active' : 'Upgrade Pro'}</span>
          </button>
        )}

        {currentAudit && (
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
              title="Export JSON"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>JSON</span>
            </button>
            <button
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
              title="Print PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className={isConnected ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
            {isConnected ? 'API Online' : 'Offline'}
          </span>
        </div>

        {/* User Account / Profile Section */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-none">{user.name || 'Developer'}</span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">{user.isPro ? 'Pro Member' : 'Free Tier'}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-[11px]"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal({ mode: 'login' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
