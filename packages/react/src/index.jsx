import React, { createContext, useContext, useEffect, useRef } from 'react';

const AuditPulseContext = createContext(null);

export function AuditPulseProvider({
  apiKey,
  endpoint = 'https://api.auditpulse.io/v1/telemetry',
  trackComponentRenders = true,
  sampleRate = 1.0,
  children
}) {
  const telemetryQueue = useRef([]);

  useEffect(() => {
    if (!apiKey) {
      console.warn('[AuditPulse] Missing apiKey in <AuditPulseProvider />');
      return;
    }

    // Initialize PerformanceObserver for Core Web Vitals (LCP, TTI, CLS, Long Tasks)
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Long task > 50ms
              telemetryQueue.current.push({
                type: 'long-task',
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
                timestamp: Date.now()
              });
            }
          }
        });
        observer.observe({ type: 'longtask', buffered: true });
      } catch (err) {
        // Fallback for browsers without longtask support
      }
    }

    // Flush telemetry queue periodically via sendBeacon
    const interval = setInterval(() => {
      if (telemetryQueue.current.length > 0) {
        const batch = telemetryQueue.current.splice(0, 50);
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, JSON.stringify({ apiKey, batch }));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [apiKey, endpoint]);

  // React Fiber Profiler callback
  const handleRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    if (!trackComponentRenders || Math.random() > sampleRate) return;

    if (actualDuration > 16) { // Slow render frame > 16ms
      telemetryQueue.current.push({
        type: 'fiber-render',
        id,
        phase,
        actualDuration,
        baseDuration,
        commitTime,
        timestamp: Date.now()
      });
    }
  };

  return (
    <AuditPulseContext.Provider value={{ apiKey, trackComponentRenders, sampleRate }}>
      <React.Profiler id="AuditPulseRoot" onRender={handleRenderCallback}>
        {children}
      </React.Profiler>
    </AuditPulseContext.Provider>
  );
}

export function useAuditPulse() {
  const context = useContext(AuditPulseContext);
  if (!context) {
    throw new Error('useAuditPulse must be used within an <AuditPulseProvider />');
  }
  return context;
}
