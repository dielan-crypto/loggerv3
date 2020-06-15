const FoundationDBDriver = require('../../../../../eris-collection-wingman/index').FoundationDBDriver

module.exports = new FoundationDBDriver({
  apiVersion: 600,
  databasePrefix: 'testfdb.'
})
