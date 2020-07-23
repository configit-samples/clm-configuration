const proxy = require('./lib');
const express = require('express');
const server = express();
server.post('*', proxy);
module.exports = server;
