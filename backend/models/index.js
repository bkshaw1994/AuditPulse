const { MongoModel, CrawlResultRepository } = require('./CrawlResult');
const { FeatureFlag, FeatureFlagRepository } = require('./FeatureFlag');

module.exports = {
  MongoModel,
  CrawlResultRepository,
  FeatureFlag,
  FeatureFlagRepository
};
