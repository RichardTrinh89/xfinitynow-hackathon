module.exports = {
  set: function(server) {
      // Include version 1 api routes
      require('./api/v1/xfinitynow/routes').set(server);
  }
};
