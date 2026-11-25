const auditRoutes = require('./audit');
const flagRoutes = require('./flags');
const billingRoutes = require('./billing');
const authRoutes = require('./auth');
const analyticsRoutes = require('./analytics');
const externalAuditRoutes = require('./externalAudit');

module.exports = {
  auditRoutes,
  flagRoutes,
  billingRoutes,
  authRoutes,
  analyticsRoutes,
  externalAuditRoutes
};
