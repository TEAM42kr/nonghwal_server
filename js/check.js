exports.checkDUP = function(flag) {
    console.log(flag);

    let query;

    if (flag == 1) {
        query = 'select USER_MAIL from USER where USER_MAIL = ?';
        return query;
    } else {
        query = 'select USER_MAIL from USER where USER_NICKNAME = ?';
        return query;
    }
}