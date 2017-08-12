// Initializes the `db` service on path `/db`
const createService = require('feathers-nedb');
const createModel = require('../../models/db.model');
const hooks = require('./db.hooks');
const filters = require('./db.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);

  const options = {
    name: 'db',
    Model,
  };

  // Initialize our service with any options it requires
  app.use('/db', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('db');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
