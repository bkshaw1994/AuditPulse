import React from 'react';
import { Lock } from 'lucide-react';

export default function PageHeader({
  badge,
  title,
  subtitle,
  icon: Icon,
  iconBg = 'bg-indigo-50 border-indigo-200 text-indigo-600',
  currentAudit,
  proBadge = false,
  actions
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-mono font-bold flex items-center gap-1">
                {badge}
              </span>
            )}
            {proBadge && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                PRO FEATURE
              </span>
            )}
            {currentAudit && currentAudit.url && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-bold text-slate-900 truncate">{currentAudit.domain || currentAudit.url}</span>
              </span>
            )}
            {currentAudit && currentAudit.timestamp && (
              <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
                • Audited {new Date(currentAudit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
