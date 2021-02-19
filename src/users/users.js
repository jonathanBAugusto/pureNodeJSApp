const Ut = require('../../resources/utils.js');
const Data = require('../../resources/data.js');
const { findSourceMap } = require('module');

let users = {};

users.post = (data, callback) => {
  const firstName = Ut.checkString(data.body.firstName);
  const lastName = Ut.checkString(data.body.lastName);
  const phone = Ut.checkString(data.body.phone, 10, 12);
  const password = Ut.checkString(data.body.password);
  const tosAgreement = Ut.checkBool(data.body.tosAgreement);

  if (firstName && lastName && phone && password && tosAgreement) {
    Data.read('users', phone, function (err, data) {
      if (!err) {
        callback(400, { 'Error': 'A user with that phone already exists' });
        return;
      }

      const hashedPassword = Ut.hash(password);

      if (hashedPassword) {
        const newUser = {
          'firstName': firstName,
          'lastName': lastName,
          'phone': phone,
          'hashedPassword': hashedPassword,
          'tosAgreement': true,
        }

        Data.create('users', phone, newUser, function (err) {
          if (err) {
            console.log(err);
            callback(500, { 'Error': 'Could not create the new user' });
            return;
          }

          callback(200);
        });
      } else {
        callback(500, { 'Error': 'Could not hash the user\'s password' });
      }
    });
  } else {
    callback(400, { 'Erro': 'Missing required fields' })
  }

};

users.get = (data, callback) => {
  const phone = typeof (data.queryStringObject.phone) == 'string'
    && (data.queryStringObject.phone.trim().length >= 8 && data.queryStringObject.phone.trim().length <= 11)
    ? data.queryStringObject.phone.trim()
    : false;

  if (phone) {
    Data.read('users', phone, (err, data) => {
      if (!err) {
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

users.put = (data, callback) => {
  const phone = typeof (data.body.phone) == 'string'
    && (data.body.phone.trim().length >= 8 && data.body.phone.trim().length <= 11)
    ? data.body.phone.trim()
    : false;

  const firstName = Ut.checkString(data.body.firstName);
  const lastName = Ut.checkString(data.body.lastName);
  const password = Ut.checkString(data.body.password);

  if (phone) {
    if (firstName || lastName || password) {
      Data.read('users', phone, (err, userData) => {
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.hashedPassword = Ut.hash(password);
          }

          Data.update('users', phone, userData, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, 'Could not update the user');
            }
          })
        } else {
          callback(400, {
            'Error': 'The specified user does not exist'
          })
        }
      });
    } else {
      callback(400, {
        'Error': 'Missing fields to update'
      });
    }
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }

};
users.delete = (data, callback) => {
  const phone = typeof (data.queryStringObject.phone) == 'string'
    && (data.queryStringObject.phone.trim().length >= 8 && data.queryStringObject.phone.trim().length <= 11)
    ? data.queryStringObject.phone.trim()
    : false;

  if (phone) {
    Data.read('users', phone, (err, data) => {
      if (!err && data) {
        Data.delete('users', phone, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              'Error': 'Could not delete the specified user'
            });
          }
        });
      } else {
        callback(404, {
          'Error': 'Could not find the specified user'
        });
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    });
  }
};

module.exports = users;
