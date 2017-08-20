const assert = require('assert');
const app = require('../../src/app');

describe('\'playlist\' service', () => {
  it('registered the service', () => {
    const service = app.service('playlist');

    assert.ok(service, 'Registered the service');
  });
});
