import React from 'react';

export interface AuditPulseConfig {
  apiKey: string;
  endpoint?: string;
  sampleRate?: number;
  debug?: boolean;
}

export interface TrackerInstance {
  destroy: () => void;
  getMetrics: () => {
    lcp: number;
    inp: number;
    cls: number;
    ttfb: number;
    fcp: number;
    longTasksCount: number;
    maxLongTaskDuration: number;
  };
}

export function initAuditPulse(config: AuditPulseConfig): TrackerInstance;

export interface AuditPulseTrackerProps {
  apiKey: string;
  endpoint?: string;
  trackComponentRenders?: boolean;
  sampleRate?: number;
  debug?: boolean;
  children?: React.ReactNode;
}

export const AuditPulseTracker: React.FC<AuditPulseTrackerProps>;
export const AuditPulseProvider: React.FC<AuditPulseTrackerProps>;
export default AuditPulseTracker;

export function useAuditPulse(): { apiKey: string; trackComponentRenders: boolean };
