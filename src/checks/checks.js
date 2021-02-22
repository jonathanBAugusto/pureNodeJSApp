import * as Utils from '../../resources/utils.js';
import Data from '../../resources/data.js';
import config from '../../config.js';

const checks = {};

checks.get = (data, callback) => { };

checks.post = (data, callback) => {
    const protocol = Utils.checkStringIndexOf(['http', 'https'], data.body.protocol);
    const url = Utils.checkString(data.body.url);
    const method = Utils.checkStringIndexOf(['get', 'post', 'put', 'delete'], data.body.method.toLowerCase());
    const successCodes = Utils.checkObject(data.body.successCodes, Array, 0);
    const timeoutSeconds = typeof (data.body.timeoutSeconds) == 'number' && data.body.timeoutSeconds % 1 === 0
        && data.body.timeoutSeconds >= 1 && data.body.timeoutSeconds <= 5 ? data.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {

        const token = Utils.checkString(data.headers.token, 25, 25);

        if (token) {
            Data.read('tokens', token, (err, tokenData) => {
                if (!err && tokenData) {
                    const phone = Utils.checkString(tokenData.phone, 8, 12);
                    if (phone) {
                        Data.read('users', phone, (err, userData) => {
                            if (!err && userData) {
                                const userChecks = Utils.checkObject(userData.checks, Array, null, null, []);
                                if (userChecks.length < config.maxChecks) {
                                    const checkId = Utils.createRandomString(20);
                                    const checkObj = {
                                        'id': checkId,
                                        'userPhone': phone,
                                        'protocol': protocol,
                                        'url': url,
                                        'method': method,
                                        'successCodes': successCodes,
                                        'timeoutSeconds': timeoutSeconds,
                                    }

                                    Data.create('checks', checkId, checkObj, (err) => {
                                        if (!err) {
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);
                                            Data.update('users', phone, userData, (err) => {
                                                if (!err) {
                                                    callback(200, checkObj);
                                                } else {
                                                    callback(500, { 'Error': 'Could not update the new check' });
                                                }
                                            })
                                        } else {
                                            callback(500, { 'Error': 'Could not create the new check' });
                                        }
                                    });
                                } else {
                                    callback(400, {
                                        'Error': `The user already has the maximum number of checks (${config.maxChecks} checks)`
                                    });
                                }
                            } else {
                                callback(403);
                            }
                        })
                    } else {
                        callback(400);
                    }
                } else {
                    callback(403);
                }
            });
        } else {
            callback(400, { 'Error': 'The token is missing' });
        }
    } else {
        callback(400, { 'Error': 'Missing required inputs, or inputs are invalid' });
    }
};

checks.put = (data, callback) => { };

checks.delete = (data, callback) => { };

export default checks;
