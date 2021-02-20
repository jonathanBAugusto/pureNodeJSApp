const handlers = require('./handlers.js');

let router = {
  'sample': handlers.sample,
  'ping': handlers.ping,
  'users': handlers.users,
  'tokens': handlers.tokens,
};

module.exports = {
  'handlers': handlers,
  'routes': router,
};
