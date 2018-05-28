exports.checkDUP = function(flag) {
    let query;

    if (flag == 1) {
        query = 'select USER_MAIL from USER where USER_MAIL = ?';
        return query;
    } else {
        query = 'select USER_MAIL from USER where USER_NICKNAME = ?';
        return query;
    }
}

exports.checkAuth = function(req) {
    const jwt = require('jsonwebtoken');
    const token = req.headers["authorization"];
    const secretKey = req.app.get('jwt-secret');
    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
        return false;
    } else {
        return decoded;
    }
}