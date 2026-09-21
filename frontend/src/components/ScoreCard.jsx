import React from 'react';
import { ShieldCheck, Zap, Share2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ScoreCard({ scores = {}, issuesCount = 0 }) {
  const overall = scores.overall || 0;
  const seo = scores.seo || 0;
  const performance = scores.performance || 0;
  const social = scores.social || 0;

  const getScoreColorClass = (val) => {
    if (val >= 90) return 'text-emerald-600';
    if (val >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgClass = (val) => {
    if (val >= 90) return 'bg-emerald-500';
    if (val >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getScoreLabel = (val) => {
    if (val >= 90) return 'Optimal Health';
    if (val >= 70) return 'Needs Work';
    return 'Action Required';
  };

  const strokeDashoffset = 283 - (283 * overall) / 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Overall Health Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden">
        
        {/* Dual Ring Circular Gauge */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              className={getScoreColorClass(overall)}
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">{overall}</span>
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">/ 100</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
            Overall Health
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {getScoreLabel(overall)}
          </h3>
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            {issuesCount === 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 0 Critical Issues
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-semibold">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> {issuesCount} Issue(s)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Score Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Dynamic SEO Tags</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className={`text-3xl font-extrabold font-mono ${getScoreColorClass(seo)}`}>
            {seo}<span className="text-xs text-slate-400 font-normal ml-1">/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className={`h-full ${getScoreBgClass(seo)} rounded-full transition-all duration-500`} style={{ width: `${seo}%` }} />
          </div>
        </div>
      </div>

      {/* Performance Score Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Core Web Vitals</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className={`text-3xl font-extrabold font-mono ${getScoreColorClass(performance)}`}>
            {performance}<span className="text-xs text-slate-400 font-normal ml-1">/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className={`h-full ${getScoreBgClass(performance)} rounded-full transition-all duration-500`} style={{ width: `${performance}%` }} />
          </div>
        </div>
      </div>

      {/* Social Tags Score Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Social OpenGraph</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Share2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className={`text-3xl font-extrabold font-mono ${getScoreColorClass(social)}`}>
            {social}<span className="text-xs text-slate-400 font-normal ml-1">/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className={`h-full ${getScoreBgClass(social)} rounded-full transition-all duration-500`} style={{ width: `${social}%` }} />
          </div>
        </div>
      </div>

    </div>
  );
}
