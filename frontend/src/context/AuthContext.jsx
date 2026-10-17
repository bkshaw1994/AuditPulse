import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auditpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('auditpulse_token') || null;
    } catch (e) {
      return null;
    }
  });

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login', // 'login' | 'signup'
    title: '',
    subtitle: '',
    intent: null, // e.g., 'pro'
    onAuthenticated: null
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auditpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auditpulse_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auditpulse_token', token);
    } else {
      localStorage.removeItem('auditpulse_token');
    }
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const register = async ({ name, email, password, company, gstin }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, company, gstin })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed.');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const socialLogin = async (provider = 'github') => {
    const res = await fetch('/api/auth/social-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Social sign-in failed.');
    }
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auditpulse_user');
    localStorage.removeItem('auditpulse_token');
    try {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      // ignore
    }
  };

  const upgradeUser = async ({ plan = 'pro', billingCycle = 'monthly', currency = 'INR' } = {}) => {
    if (!user) {
      throw new Error('User must be logged in to upgrade.');
    }
    const res = await fetch('/api/auth/upgrade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        email: user.email,
        plan,
        billingCycle,
        currency
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Subscription upgrade failed.');
    }
    setUser(data.user);
    return data.user;
  };

  const openAuthModal = ({
    mode = 'login',
    title = '',
    subtitle = '',
    intent = null,
    onAuthenticated = null
  } = {}) => {
    setAuthModal({
      isOpen: true,
      mode,
      title,
      subtitle,
      intent,
      onAuthenticated
    });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({
      ...prev,
      isOpen: false,
      onAuthenticated: null
    }));
  };

  // Helper method: requireAuth
  // If authenticated: immediately calls onAuthenticated(user)
  // If not: opens modal and executes onAuthenticated after login/signup
  const requireAuth = ({
    intent = 'pro',
    title = 'Account Required',
    subtitle = 'Please sign in or create an account to proceed.',
    mode = 'signup',
    onAuthenticated
  }) => {
    if (user) {
      if (typeof onAuthenticated === 'function') {
        onAuthenticated(user);
      }
      return true;
    }

    openAuthModal({
      mode,
      intent,
      title,
      subtitle,
      onAuthenticated
    });
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isPro: !!user?.isPro,
        login,
        register,
        socialLogin,
        logout,
        upgradeUser,
        authModal,
        openAuthModal,
        closeAuthModal,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
