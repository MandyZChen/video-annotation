const assert = require('assert');
const app = require('../../src/app');

describe('\'mongo\' service', () => {
  it('registered the service', () => {
    const service = app.service('mongo');

    assert.ok(service, 'Registered the service');
  });
});
