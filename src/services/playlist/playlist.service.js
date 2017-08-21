// Initializes the `playlist` service on path `/playlist`
const createService = require('./playlist.class.js');
const hooks = require('./playlist.hooks');
const filters = require('./playlist.filters');

module.exports = function () {
  const app = this;

  const options = {
    name: 'playlist',
    apiKey: app.get('apiKey'),
  };

  // Initialize our service with any options it requires
  app.use('/playlist', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('playlist');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
