import React, { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Core Browser Performance Observer for Core Web Vitals (LCP, INP, CLS) & Navigation
 */
export function initAuditPulse({
  apiKey,
  endpoint = 'https://api.auditpulse.io/v1/telemetry',
  sampleRate = 1.0,
  debug = false
}) {
  if (typeof window === 'undefined') return { destroy: () => {} };

  if (!apiKey) {
    console.warn('[AuditPulse] Missing apiKey in tracker initialization.');
    return { destroy: () => {} };
  }

  if (Math.random() > sampleRate) {
    if (debug) console.log('[AuditPulse] Session sampled out.');
    return { destroy: () => {} };
  }

  const state = {
    lcp: 0,
    inp: 0,
    cls: 0,
    ttfb: 0,
    fcp: 0,
    longTasksCount: 0,
    maxLongTaskDuration: 0,
    queue: []
  };

  const log = (...args) => {
    if (debug) console.log('[AuditPulse Tracker]', ...args);
  };

  // Helper to send telemetry batch safely
  const flush = (immediate = false) => {
    if (state.queue.length === 0 && !immediate) return;

    const payload = JSON.stringify({
      apiKey,
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics: {
        lcp: state.lcp,
        inp: state.inp,
        cls: parseFloat(state.cls.toFixed(4)),
        ttfb: state.ttfb,
        fcp: state.fcp,
        longTasksCount: state.longTasksCount,
        maxLongTaskDuration: state.maxLongTaskDuration
      },
      events: state.queue.splice(0, 50)
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, payload);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      }).catch(() => {});
    }
  };

  // 1. Navigation Timing (TTFB)
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      state.ttfb = Math.round(nav.responseStart - nav.requestStart);
    }
  } catch (e) {}

  // 2. Paint Timing (FCP)
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            state.fcp = Math.round(entry.startTime);
            log('FCP Captured:', state.fcp);
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {}

    // 3. Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          state.lcp = Math.round(lastEntry.startTime);
          log('LCP Captured:', state.lcp);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    // 4. Interaction to Next Paint (INP)
    try {
      const inpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.duration > state.inp) {
            state.inp = Math.round(entry.duration);
            log('INP High Interaction Captured:', state.inp, entry.name);
          }
        }
      });
      inpObserver.observe({ type: 'event', durationThreshold: 40, buffered: true });
    } catch (e) {}

    // 5. Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            state.cls += entry.value;
            log('CLS Shift Captured:', state.cls);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    // 6. Long Tasks (>50ms main-thread blockage)
    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          state.longTasksCount++;
          if (entry.duration > state.maxLongTaskDuration) {
            state.maxLongTaskDuration = Math.round(entry.duration);
          }
          if (entry.duration > 80) {
            state.queue.push({
              type: 'long-task',
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime)
            });
          }
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch (e) {}
  }

  // Periodic flush & unload flush
  const interval = setInterval(() => flush(false), 12000);
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') flush(true);
  };
  window.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', () => flush(true));

  log('Initialized successfully for API key:', apiKey);

  return {
    destroy: () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', onVisibilityChange);
      flush(true);
    },
    getMetrics: () => ({ ...state })
  };
}

/**
 * React Context & Components
 */
const AuditPulseContext = createContext(null);

export function AuditPulseTracker({
  apiKey,
  endpoint = 'https://api.auditpulse.io/v1/telemetry',
  trackComponentRenders = true,
  sampleRate = 1.0,
  debug = false,
  children
}) {
  const trackerRef = useRef(null);

  useEffect(() => {
    trackerRef.current = initAuditPulse({
      apiKey,
      endpoint,
      sampleRate,
      debug
    });

    return () => {
      if (trackerRef.current) trackerRef.current.destroy();
    };
  }, [apiKey, endpoint, sampleRate, debug]);

  const handleRenderCallback = (id, phase, actualDuration) => {
    if (!trackComponentRenders) return;
    if (actualDuration > 16 && debug) {
      console.warn(`[AuditPulse] Slow React Fiber Render in <${id}>: ${actualDuration.toFixed(1)}ms (${phase})`);
    }
  };

  return (
    <AuditPulseContext.Provider value={{ apiKey, trackComponentRenders }}>
      {trackComponentRenders ? (
        <React.Profiler id="AuditPulseRoot" onRender={handleRenderCallback}>
          {children}
        </React.Profiler>
      ) : (
        children
      )}
    </AuditPulseContext.Provider>
  );
}

export function useAuditPulse() {
  const ctx = useContext(AuditPulseContext);
  if (!ctx) {
    throw new Error('useAuditPulse must be used within an <AuditPulseTracker />');
  }
  return ctx;
}
