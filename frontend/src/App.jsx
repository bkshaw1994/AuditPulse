import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LandingPage, DashboardPage, NotFoundPage } from './pages';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/modals';

export default function App() {
  return (
    <AuthProvider>
      <Analytics />
      <BrowserRouter>
        <Routes>
          {/* Route 1: SaaS Marketing Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Route 2: Studio Auditor Workspace & Dashboard */}
          <Route path="/app/*" element={<DashboardPage />} />

          {/* 404 Catch-All Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* Global Authentication Modal */}
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  );
}
