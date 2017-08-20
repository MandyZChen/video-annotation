const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'db.db'),
    autoload: true
  });
  console.warn('loading DB at ' + path.join(dbPath, 'db.db'));
  return Model;
};
