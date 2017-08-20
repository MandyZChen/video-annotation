const db = require('./db/db.service.js');
const playlist = require('./playlist/playlist.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(db);
  app.configure(playlist);
};
