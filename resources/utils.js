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
    return value.toLowerCase() == 'true';
  }

  return value;
}

function checkNumber(value, min = false, max = false) {
  if (!value || typeof (value) != 'number') {
    return false;
  }

  if (min && value < min) {
    return false;
  }

  if (max && value > max) {
    return false;
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

function createRandomString(strLength) {
  strLength = checkNumber(strLength, 0);
  if (!strLength) {
    return false;
  }

  const possibChars = 'abcdefghijklmnoprstuvwxyz@!ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
  let str = '';

  for (let i = 0; i < strLength; i++) {
    let randChar = possibChars.charAt(Math.floor(Math.random() * possibChars.length));
    str += randChar;
  }

  return str;
}

module.exports = {
  checkBool,
  checkString,
  createIfNotExistsDir,
  createRandomString,
  hash,
  parseJsonToObject,
};
