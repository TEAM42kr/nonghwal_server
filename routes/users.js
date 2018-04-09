const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const pool = require('../config/db_pool');
const bcrypt = require('bcrypt-nodejs');
const check = require('../js/check.js');
const mysql = require('mysql');
const saltRounds = 10;


// var checkDUP = function(flag) {
//     console.log('내가 받은' + flag);

//     // let flag = flag;
//     let query;

//     if (flag == 1) {
//         query = 'select USER_MAIL from USER where USER_MAIL = ?';
//         return query;
//     } else {
//         query = 'select USER_MAIL from USER where USER_NICKNAME = ?';
//         return query;
//     }
// }


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', function(req, res) {

});


//중복체크를 위한 api로 flag값으로 email중복체크인지, nickname중복체크인지를 구분하여 쿼리 실행
router.post('/dup', function(req, res) {
    pool.getConnection(function(error, connection) {
        if (error) {
            console.log("getConnection Error" + error);
            res.status(503).json({ msg: '1' });
            connection.release();
        } else {
            if (!req.body.flag || !req.body.checkValue) {
                console.log("client Error" + req.body.flag + req.body.checkValue);
                res.status(200).json({ msg: '5' });
                connection.release();
            } else {
                var flag = req.body.flag;
                let checkValue = req.body.checkValue;
                console.log(flag);
                console.log('say' + checkValue);

                let query = check.checkDUP(flag);
                connection.query(query, [checkValue], function(error, result) {
                    if (error) {
                        console.log("selecting Error" + error);
                        res.status(503).json({ msg: '2' });
                        connection.release();
                    } else {
                        //중복된 값이 없을 경우
                        if (result.length == 0) {
                            res.status(200).json({ msg: '3' });
                            connection.release();
                        }
                        //중복된 값이 있을 경우
                        else {
                            res.status(200).json({ msg: '4' });
                            connection.release();
                        }
                    }
                });
            }
        }
    })
});

router.post('/login', function(req, res) {

});

router.post('/logout', function(req, res) {

});



module.exports = router;