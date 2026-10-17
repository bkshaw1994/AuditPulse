const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Helper to hash password with salt
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_auditpulse_salt_2026').digest('hex');
}

// In-memory user store with pre-seeded demo accounts
const users = new Map();

// Demo Account 1
const demoUser1 = {
  id: 'usr_demo_101',
  name: 'Alex Developer',
  email: 'developer@auditpulse.io',
  passwordHash: hashPassword('password123'),
  company: 'PulseCart Inc.',
  gstin: '',
  isPro: false,
  plan: 'free',
  createdAt: new Date().toISOString()
};
users.set(demoUser1.email.toLowerCase(), demoUser1);

// Demo Account 2 (Indian Market Startup with GSTIN)
const demoUser2 = {
  id: 'usr_demo_102',
  name: 'Rohit Sharma',
  email: 'rohit@techstartup.in',
  passwordHash: hashPassword('propass123'),
  company: 'NextGen Cloud Labs India',
  gstin: '29AABCU9603R1ZM',
  isPro: false,
  plan: 'free',
  createdAt: new Date().toISOString()
};
users.set(demoUser2.email.toLowerCase(), demoUser2);

// Session token store: token -> user
const tokens = new Map();

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * POST /api/auth/register
 * Create a new user account
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password, company = '', gstin = '' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (users.has(normalizedEmail)) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists. Please sign in.' });
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      company: company.trim(),
      gstin: gstin.trim().toUpperCase(),
      isPro: false,
      plan: 'free',
      createdAt: new Date().toISOString()
    };

    users.set(normalizedEmail, newUser);

    const token = `apt_${crypto.randomBytes(24).toString('hex')}`;
    tokens.set(token, normalizedEmail);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: sanitizeUser(newUser),
      token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Sign in with existing credentials
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, error: 'No account found with this email. Please create an account.' });
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
    }

    const token = `apt_${crypto.randomBytes(24).toString('hex')}`;
    tokens.set(token, normalizedEmail);

    return res.json({
      success: true,
      message: 'Signed in successfully',
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/social-login
 * 1-click social sign-in simulation (GitHub / Google)
 */
router.post('/social-login', (req, res) => {
  try {
    const { provider = 'github', email, name } = req.body;
    const resolvedEmail = (email || `${provider}_developer@example.com`).toLowerCase();
    const resolvedName = name || (provider === 'github' ? 'GitHub Developer' : 'Google Cloud User');

    let user = users.get(resolvedEmail);
    if (!user) {
      user = {
        id: `usr_${provider}_${Date.now()}`,
        name: resolvedName,
        email: resolvedEmail,
        passwordHash: hashPassword('social_oauth_random_' + Math.random()),
        company: `${provider.toUpperCase()} Team`,
        gstin: '',
        isPro: false,
        plan: 'free',
        provider,
        createdAt: new Date().toISOString()
      };
      users.set(resolvedEmail, user);
    }

    const token = `apt_${crypto.randomBytes(24).toString('hex')}`;
    tokens.set(token, resolvedEmail);

    return res.json({
      success: true,
      message: `Signed in via ${provider}`,
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const email = tokens.get(token);

    if (!email || !users.has(email)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid' });
    }

    const user = users.get(email);
    return res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/upgrade
 * Activate Pro subscription for the logged in user
 */
router.post('/upgrade', (req, res) => {
  try {
    const { email, plan = 'pro', billingCycle = 'monthly', currency = 'INR' } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    let user = users.get(normalizedEmail);
    if (!user) {
      // Look up via token if provided in header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const tokenEmail = tokens.get(token);
        if (tokenEmail) user = users.get(tokenEmail);
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Please sign in or create an account to activate your subscription' });
    }

    // Upgrade user record
    user.isPro = true;
    user.plan = plan;
    user.billingCycle = billingCycle;
    user.currency = currency;
    user.subscribedAt = new Date().toISOString();
    user.proExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    users.set(user.email, user);

    return res.json({
      success: true,
      message: `Successfully activated ${plan.toUpperCase()} plan for ${user.email}`,
      user: sanitizeUser(user)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    tokens.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
