import Crypto from 'crypto';
import Config from '../config.js';
import fs from 'fs';

function checkString(value, minLength = 0, maxLength = 0) {
  if (!value || typeof (value) != 'string')
    return false;

  if (value.length < minLength)
    return false;

  if (maxLength > 0) {
    if (value.length > maxLength)
      return false;
  }

  return value;
}

function checkStringIndexOf(arrayStack, value, minLength = 0, maxLength = 0) {
  if (!checkString(value, minLength, maxLength)) {
    return false;
  }

  return arrayStack.indexOf(value) > -1 ? value : false;
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

function checkObject(obj, typeInstance, minLength = null, maxLength = null, valueDefault = false) {
  if (obj == null || obj == undefined) {
    return valueDefault;
  }

  if (!(obj instanceof typeInstance)) {
    return valueDefault;
  }

  if (minLength != null) {
    if (obj.length < minLength) {
      return valueDefault;
    }
  }

  if (maxLength != null) {
    if (obj.length > maxLength) {
      return valueDefault;
    }
  }

  return obj;
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

export {
  checkBool,
  checkObject,
  checkString,
  checkStringIndexOf,
  createIfNotExistsDir,
  createRandomString,
  hash,
  parseJsonToObject,
};
