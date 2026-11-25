const crawler = require('./crawler');
const externalScanner = require('./externalScanner');

module.exports = {
  ...crawler,
  crawler,
  externalScanner
};
