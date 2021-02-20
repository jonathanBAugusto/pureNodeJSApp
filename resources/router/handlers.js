const Users = require('../../src/users/users.js');
const Tokens = require('../../src/tokens/tokens.js');
let handlers = {};

handlers.ping = (data, callback) => {
  callback(200);
};

handlers.sample = (data, callback) => {
  callback(406, { 'sample': 'sample Handlers' });
};

handlers.notFound = (data, callback) => {
  callback(404);
};

handlers.users = (data, callback) => {
  const okMethods = ['post', 'get', 'put', 'delete'];
  if (okMethods.indexOf(data.method) == -1) {
    callback(405);
    return;
  }

  Users[data.method](data, callback);
};

handlers.tokens = (data, callback) => {
  const okMethods = ['post', 'get', 'put', 'delete'];
  if (okMethods.indexOf(data.method) == -1) {
    callback(405);
    return;
  }

  Tokens[data.method](data, callback);
};

module.exports = handlers;
