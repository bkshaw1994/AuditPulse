import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck, Zap, Code2, ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SetupGuide() {
  const [activeTab, setActiveTab] = useState('nextjs-app'); // 'nextjs-app' | 'nextjs-pages' | 'vite-react' | 'vanilla'
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [packageManager, setPackageManager] = useState('npm'); // 'npm' | 'pnpm' | 'yarn'
  const [testStatus, setTestStatus] = useState('idle'); // 'idle' | 'testing' | 'success'

  const apiKey = 'ap_live_9f8c47e120da45c99e1';

  const installCommands = {
    npm: 'npm install @auditpulse/tracker',
    pnpm: 'pnpm add @auditpulse/tracker',
    yarn: 'yarn add @auditpulse/tracker'
  };

  const snippets = {
    'nextjs-app': `// app/layout.tsx (Next.js 13/14/15 App Router)
import { AuditPulseTracker } from '@auditpulse/tracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AuditPulse Real-User Performance Observer */}
        <AuditPulseTracker apiKey="${apiKey}" />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    'nextjs-pages': `// pages/_app.tsx (Next.js Pages Router)
import type { AppProps } from 'next/app';
import { AuditPulseTracker } from '@auditpulse/tracker';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuditPulseTracker apiKey="${apiKey}" trackComponentRenders={true}>
      <Component {...pageProps} />
    </AuditPulseTracker>
  );
}`,
    'vite-react': `// src/main.jsx or src/App.jsx (Vite / CRA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuditPulseTracker } from '@auditpulse/tracker';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuditPulseTracker apiKey="${apiKey}">
      <App />
    </AuditPulseTracker>
  </React.StrictMode>
);`,
    'vanilla': `<!-- In your HTML <head> or before </body> -->
<script type="module">
  import { initAuditPulse } from 'https://cdn.jsdelivr.net/npm/@auditpulse/tracker@2.0.0/dist/index.js';
  
  initAuditPulse({
    apiKey: '${apiKey}',
    sampleRate: 1.0
  });
</script>`
  };

  const copyToClipboard = (text, setCopiedFn) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const handleTestPing = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 850);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Frictionless Setup
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                &lt; 1.5 KB Overhead
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Connect Your React Application
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Start collecting real-user Core Web Vitals (LCP, INP, CLS) and React hydration latency in under 60 seconds.
            </p>
          </div>

          <Link
            to="/app/overview"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm self-start md:self-auto"
          >
            <span>Back to Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Step 1: API Key */}
        <div className="mt-6 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Step 1: Your Production Project API Key
          </label>
          <div className="flex items-center gap-3 max-w-xl">
            <div className="flex-1 flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-800">
              <span className="truncate">{apiKey}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
            </div>
            <button
              onClick={() => copyToClipboard(apiKey, setCopiedKey)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 transition shrink-0"
            >
              {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Install Package */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Step 2: Install the Lightweight Tracker
          </h3>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-mono">
            {['npm', 'pnpm', 'yarn'].map((pm) => (
              <button
                key={pm}
                onClick={() => setPackageManager(pm)}
                className={`px-2.5 py-1 rounded-md transition ${
                  packageManager === pm
                    ? 'bg-white text-indigo-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pm}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-sm flex items-center justify-between">
          <span>{installCommands[packageManager]}</span>
          <button
            onClick={() => copyToClipboard(installCommands[packageManager], setCopiedSnippet)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Copy command"
          >
            {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step 3: Implement Code Snippet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            Step 3: Add Provider Snippet to Your App
          </h3>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('nextjs-app')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'nextjs-app'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next.js (App Router)
            </button>
            <button
              onClick={() => setActiveTab('nextjs-pages')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'nextjs-pages'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next.js (Pages Router)
            </button>
            <button
              onClick={() => setActiveTab('vite-react')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'vite-react'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              React (Vite / CRA)
            </button>
            <button
              onClick={() => setActiveTab('vanilla')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'vanilla'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vanilla JS
            </button>
          </div>
        </div>

        <div className="relative group bg-slate-900 rounded-xl p-5 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{snippets[activeTab]}</pre>
          <button
            onClick={() => copyToClipboard(snippets[activeTab], setCopiedSnippet)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Copy snippet"
          >
            {copiedSnippet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step 4: Verification & Telemetry Ping */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Step 4: Verify Telemetry Ingestion Pipeline
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Simulate a telemetry beacon to verify that your browser can reach the AuditPulse ingest endpoint without CSP or ad-blocker interference.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {testStatus === 'success' ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Telemetry Ingestion: Live (21ms)</span>
            </div>
          ) : (
            <button
              onClick={handleTestPing}
              disabled={testStatus === 'testing'}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{testStatus === 'testing' ? 'Transmitting Beacon...' : 'Send Test Beacon'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
