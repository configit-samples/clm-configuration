// @ts-ignore
require('dotenv').config();

const proxy = require('express-http-proxy');

module.exports = proxy('api-stable.clm-dev.cloud', {
  https: true,
  proxyReqOptDecorator: async function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Authorization'] = 'ApiKey ' + process.env.API_KEY;
    return proxyReqOpts;
  },
  proxyReqPathResolver: function(req) {
    var parts = req.url.split('?');
    var queryString = parts[1];
    return '/configurator/v1/configure?' + queryString;
  }
});
