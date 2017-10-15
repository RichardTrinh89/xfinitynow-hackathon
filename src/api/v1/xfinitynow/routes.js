var Joi = require('joi');
var xfinitynow = require('./views/xfinitynow');

module.exports = {
  set: function (server, prefix) {
    if (prefix === undefined)
      prefix = '/api/v1/xfinitynow';

    server.route({
      method: 'GET',
      path: prefix + '',
      config: {
        tags: ['api', 'v1'],
        description: 'Get all xfinitynow demo',
        notes: 'Get all xfinitynow demo'
      },
      handler: xfinitynow.get_all
    });

    server.route({
      method: 'POST',
      path: prefix + '/get_by_ids',
      config: {
        tags: ['api', 'v1'],
        description: 'Get xfinitynow base on ids',
        notes: 'Get xfinitynow base on ids',
        validate: {
          payload: {
            ids: Joi.array().items(Joi.string()).single()
          }
        }
      },
      handler: xfinitynow.get_by_ids
    });
  }
};

