const handlers = require('./handlers.js');

let router = {
  'sample': handlers.sample,
  'ping': handlers.ping,
  'users': handlers.users,
};

module.exports = {
  'handlers':handlers,
  'routes':router
};
