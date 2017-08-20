const playlist = require('./playlist/playlist.service.js');
const mongo = require('./mongo/mongo.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(playlist);
  app.configure(mongo);
};
