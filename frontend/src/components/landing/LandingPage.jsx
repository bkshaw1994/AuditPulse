import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import FeaturesSection from './FeaturesSection';
import LiveDemoSection from './LiveDemoSection';
import PricingSection from './PricingSection';
import Footer from './Footer';
import { fetchFeatureFlags } from '../../services/flagsApi';

export default function LandingPage({ onSwitchToDashboard }) {
  const [flags, setFlags] = useState({
    showCliFeature: false,
    showPricingFeature: false,
    showLiveDemo: true,
    showFeaturesGrid: true
  });
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const data = await fetchFeatureFlags();
      setFlags(data);
    } catch (err) {
      console.warn('[LandingPage] Could not load DB flags, using defaults:', err);
    } finally {
      setIsLoadingFlags(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Navbar */}
      <Navbar onSwitchToDashboard={onSwitchToDashboard} activeMode="landing" flags={flags} />

      {/* 1. Hero Section */}
      <HeroSection onLaunchDemo={onSwitchToDashboard} flags={flags} />

      {/* 2. The Problem ("Aha!") Section */}
      <ProblemSection />

      {/* 3. Features Grid */}
      {flags.showFeaturesGrid && <FeaturesSection flags={flags} />}

      {/* Interactive Live Demo Sandbox */}
      {flags.showLiveDemo && <LiveDemoSection onOpenFullDashboard={onSwitchToDashboard} />}

      {/* Pricing Section — Controlled by DB Feature Flag */}
      {flags.showPricingFeature && <PricingSection />}

      {/* 4. Developer-First Footer */}
      <Footer flags={flags} />
    </div>
  );
}
