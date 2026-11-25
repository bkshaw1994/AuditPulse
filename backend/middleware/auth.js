const crypto = require('crypto');

/**
 * Bearer Token Authentication Middleware
 */
function authenticateToken(tokensMap) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid Authorization header. Expected Bearer <token>.'
      });
    }

    const token = authHeader.split(' ')[1];
    const user = tokensMap ? tokensMap.get(token) : null;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Session token has expired or is invalid. Please sign in again.'
      });
    }

    req.user = user;
    next();
  };
}

/**
 * Constant-time API key validation for external CRM/outreach integrations.
 */
function authenticateExternalApiKey(req, res, next) {
  const expectedKey = process.env.AUDIT_PULSE_API_KEY || process.env.EXTERNAL_AUDIT_API_KEY;
  if (!expectedKey) {
    return res.status(503).json({
      success: false,
      error: 'AUDIT_PULSE_API_KEY is not configured on the server.'
    });
  }

  const providedKey = req.headers['x-api-key'];
  if (!providedKey || typeof providedKey !== 'string') {
    return res.status(401).json({
      success: false,
      error: 'Missing x-api-key header.'
    });
  }

  const expectedHash = crypto.createHash('sha256').update(expectedKey).digest();
  const providedHash = crypto.createHash('sha256').update(providedKey).digest();

  if (!crypto.timingSafeEqual(expectedHash, providedHash)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid x-api-key.'
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  authenticateExternalApiKey
};
