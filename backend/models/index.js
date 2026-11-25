const { MongoModel, CrawlResultRepository } = require('./CrawlResult');
const { FeatureFlag, FeatureFlagRepository } = require('./FeatureFlag');
const { ExternalReportModel, ExternalReportRepository } = require('./ExternalReport');

module.exports = {
  MongoModel,
  CrawlResultRepository,
  FeatureFlag,
  FeatureFlagRepository,
  ExternalReportModel,
  ExternalReportRepository
};
