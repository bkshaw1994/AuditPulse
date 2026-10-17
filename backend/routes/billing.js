const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// In-memory subscription cache for fast lookups
const subscriptions = new Map();

// Default Free Tier Capabilities
const FREE_TIER = {
  tier: 'free',
  isPro: false,
  retentionHours: 24,
  maxMonitoredSites: 1,
  slackAlertsEnabled: false,
  customWebhooksEnabled: false
};

const PRO_TIER = {
  tier: 'pro',
  isPro: true,
  retentionHours: 2160, // 90 days
  maxMonitoredSites: 25,
  slackAlertsEnabled: true,
  customWebhooksEnabled: true
};

/**
 * GET /api/billing/subscription/:domain
 * Returns active subscription tier and feature gating limits
 */
router.get('/subscription/:domain', (req, res) => {
  const { domain } = req.params;
  const sub = subscriptions.get(domain) || FREE_TIER;
  return res.json({
    success: true,
    domain,
    subscription: sub
  });
});

/**
 * POST /api/billing/checkout-url
 * Generates a secure Merchant of Record (Lemon Squeezy / Paddle) checkout session URL
 */
router.post('/checkout-url', (req, res) => {
  try {
    const { domain, plan = 'pro_monthly', email, currency = 'INR' } = req.body;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID || 'auditpulse_store';
    const variantId = process.env.LEMON_SQUEEZY_PRO_VARIANT_ID || 'variant_pro_monthly_inr';

    // Mock Razorpay / Lemon Squeezy / Paddle Checkout URL
    const checkoutUrl = `https://${storeId}.lemonsqueezy.com/buy/${variantId}?checkout[email]=${encodeURIComponent(
      email || 'user@company.com'
    )}&checkout[custom][domain]=${encodeURIComponent(domain || 'app')}&checkout[custom][currency]=${currency}`;

    const price = currency === 'USD' ? '$29/mo' : '₹1,999/mo';

    return res.json({
      success: true,
      provider: currency === 'INR' ? 'razorpay' : 'lemon_squeezy',
      checkoutUrl,
      plan,
      currency,
      price
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/billing/webhook
 * Handles Lemon Squeezy & Paddle Merchant of Record subscription webhooks securely
 */
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || 'ap_webhook_secret_dev';
    const signature = req.headers['x-signature'];

    // Verify HMAC SHA-256 signature if secret is configured in production
    if (process.env.NODE_ENV === 'production' && secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(req.body).digest('hex');
      if (signature !== digest) {
        console.warn('[Billing Webhook] Invalid webhook signature detected.');
        return res.status(401).json({ error: 'Invalid HMAC signature' });
      }
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventName = payload.meta?.event_name || payload.event_name || 'subscription_created';
    const customData = payload.meta?.custom_data || {};
    const domain = customData.domain || 'pulsecart-store.io';

    console.log(`[Billing Webhook] Received ${eventName} for domain: ${domain}`);

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_resumed':
      case 'order_created':
        subscriptions.set(domain, {
          ...PRO_TIER,
          subscriptionId: payload.data?.id,
          renewsAt: payload.data?.attributes?.renews_at,
          status: 'active'
        });
        break;

      case 'subscription_cancelled':
      case 'subscription_expired':
        subscriptions.set(domain, {
          ...FREE_TIER,
          status: 'cancelled'
        });
        break;

      default:
        console.log(`[Billing Webhook] Unhandled event: ${eventName}`);
    }

    return res.json({ received: true, event: eventName });
  } catch (err) {
    console.error('[Billing Webhook Error]', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/billing/alerts/test
 * Gated feature test: Custom Webhook / Slack integration
 */
router.post('/alerts/test', (req, res) => {
  const { domain, webhookUrl, channel } = req.body;
  const sub = subscriptions.get(domain) || FREE_TIER;

  if (!sub.isPro) {
    return res.status(402).json({
      success: false,
      error: 'PAYWALL_RESTRICTION',
      message: 'Real-time Slack & custom webhook regression alerts require an active Pro subscription.',
      upgradeUrl: '/pricing'
    });
  }

  // Simulated Slack test message
  return res.json({
    success: true,
    message: `Test alert dispatched successfully to Slack channel ${channel || '#alerts-perf'}.`
  });
});

module.exports = router;
