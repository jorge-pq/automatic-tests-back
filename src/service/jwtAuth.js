const jwt = require('jsonwebtoken');

const jwtConfig = require('../config').JWT;

const sign = function (data) {
    let accessToken = jwt.sign(data, jwtConfig.secret, jwtConfig.options);
    return accessToken;
};

module.exports = {
    Sign: sign
}