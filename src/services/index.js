const db = require('./db/db.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(db);
};
