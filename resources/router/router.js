import handlers from './handlers.js';

const router = {
  'sample': handlers.sample,
  'ping': handlers.ping,
  'users': handlers.users,
  'tokens': handlers.tokens,
  'checks': handlers.checks,
};

export {
  router as routes,
  handlers,
}
