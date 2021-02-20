const Ut = require('../../resources/utils.js');
const Data = require('../../resources/data.js');

const tokens = {};

tokens.get = (data, callback) => {
    const id = Ut.checkString(data.queryStringObject.id, 25, 25);
    if (id) {
        Data.read('tokens', id, (err, tokenData) => {
            if (err) {
                callback(404);
                return;
            }

            callback(200, tokenData);
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
}

tokens.post = (data, callback) => {
    const phone = Ut.checkString(data.body.phone, 8, 12);
    const password = Ut.checkString(data.body.password);

    if (!phone || !password) {
        callback(400, {
            'Error': 'Missing required field(s)'
        });
        return;
    }

    Data.read('users', phone, (err, userData) => {
        if (err || !userData) {
            callback(400, {
                'Error': 'Could not find the specified user'
            });
            return;
        }

        const hashedPassword = Ut.hash(password);
        if (hashedPassword != userData.hashedPassword) {
            callback(400, {
                'Error': 'Wrong password!'
            });
            return;
        }

        const tokenId = Ut.createRandomString(25);
        const expire = Date.now() + 1000 * 60 * 60;
        const tokenObj = {
            'phone': phone,
            'id': tokenId,
            'expires': expire,
        };

        Data.create('tokens', tokenId, tokenObj, (err) => {
            if (!err) {
                callback(200, tokenObj);
            } else {
                callback(500, {
                    'Error': 'Could not create the new token'
                });
            }
        });
    });
}

tokens.put = (data, callback) => {
    const id = Ut.checkString(data.body.id, 25, 25);
    const extend = Ut.checkBool(data.body.extend);
    if (id) {
        Data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    Data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not update the token\'s expiration'
                            })
                        }
                    })
                } else {
                    callback(500, {
                        'Error': 'The token has already expired'
                    });
                }
            } else {
                callback(400, {
                    'Error': 'Specified token does not exist'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field(s) or field(s) are invalid'
        });
    }
}

tokens.delete = (data, callback) => {
    const id = Ut.checkString(data.queryStringObject.id, 25, 25);

    if (id) {
        Data.read('tokens', id, (err, data) => {
            if (!err && data) {
                Data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not delete the specified token'
                        });
                    }
                });
            } else {
                callback(404, {
                    'Error': 'Could not find the specified token'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
}

tokens.verifyToken = (id, phone, callback) => {
    id = Ut.checkString(id, 25, 25);
    phone = Ut.checkString(phone, 8, 12);
    if (id && phone) {
        Data.read('tokens', id, (err, tokenData) => {
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}

module.exports = tokens;
