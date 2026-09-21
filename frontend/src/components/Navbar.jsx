import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Printer, FileSpreadsheet, Activity, Home, ArrowLeft } from 'lucide-react';

export default function Navbar({ currentAudit, isConnected, onExportJson, onPrintReport, onExportCsv }) {
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium">Audited Target:</span>
            <span className="font-mono text-xs font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              {currentAudit.url}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-500 font-medium">AuditPulse Diagnostic Studio</span>
        )}
      </div>

      {/* Action Controls & Health Status */}
      <div className="flex items-center gap-3">
        {currentAudit && (
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print PDF</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className={isConnected ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
            {isConnected ? 'API Online' : 'Offline Mode'}
          </span>
        </div>
      </div>
    </header>
  );
}
