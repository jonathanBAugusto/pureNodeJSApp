import Users from '../../src/users/users.js';
import Tokens from '../../src/tokens/tokens.js';
import Checks from '../../src/checks/checks.js';

let handlers = {};

function checkHttpMethods(method, okMethods = ['post', 'get', 'put', 'delete']) {
  return okMethods.indexOf(method) > -1;
}

handlers.notFound = (data, callback) => {
  callback(404, {
    'Error': 'There\'s nothing here'
  });
};

handlers.noEndpoint = (data, callback) => {
  callback(404, { 'Error': 'No endpoint here' });
};

handlers.users = (data, callback) => {
  if (!checkHttpMethods(data.method)) {
    callback(405);
    return;
  }

  Users[data.method](data, callback);
};

handlers.tokens = (data, callback) => {
  if (!checkHttpMethods(data.method)) {
    callback(405);
    return;
  }

  Tokens[data.method](data, callback);
};

handlers.checks = (data, callback) => {
  if (!checkHttpMethods(data.method)) {
    callback(405);
    return;
  }

  Checks[data.method](data, callback);
}

export default handlers;
