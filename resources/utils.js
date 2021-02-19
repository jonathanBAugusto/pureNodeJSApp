const Crypto = require('crypto');
const Config = require('../config.js');
const fs = require('fs');

function checkString(value, minLength = 0, maxLength = 0) {
  if (!value || typeof (value) != 'string')
    return false;

  if (value.trim().length < minLength)
    return false;

  if (maxLength > 0) {
    if (value.trim().length > maxLength)
      return false;
  }

  return value.trim();
}

function checkBool(value) {
  if (!value || (typeof (value) != 'string' && typeof (value) != 'boolean'))
    return false;

  if (typeof (value) == 'string') {
    return value == 'true';
  }

  return value;
}

function hash(value) {
  if (typeof (value) != 'string' || value.length == 0)
    return false;

  return Crypto.createHmac('sha256', Config.hashingSecret).update(value).digest('hex');
}

function createIfNotExistsDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function parseJsonToObject(value) {
  try {
    return JSON.parse(value || '{}');
  } catch (e) {
    console.log(e);
    return {};
  }
}

module.exports = {
  checkBool,
  checkString,
  createIfNotExistsDir,
  hash,
  parseJsonToObject,
};
