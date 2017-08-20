const MongoClient = require('mongodb').MongoClient;

module.exports = function () {
  const app = this;
  const config = app.get('mongodb');
  const promise = MongoClient.connect(config);
  console.log('Connecting to MongoDb on ' + config);
  app.set('mongoClient', promise);
};
