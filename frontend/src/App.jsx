import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import LandingPage from './components/landing/LandingPage';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  return (
    <>
      <Analytics />
      <BrowserRouter>
        <Routes>
          {/* Route 1: SaaS Marketing Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Route 2: Studio Auditor Workspace & Dashboard */}
          <Route path="/app/*" element={<DashboardLayout />} />

          {/* Catch-all redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
