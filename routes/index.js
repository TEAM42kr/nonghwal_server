const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const pool = require('../config/db_pool');
const bcrypt = require('bcrypt-nodejs');
const check = require('../js/check.js');
const mysql = require('mysql');



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* 
회원가입
    메일, 이름, 비밀번호, 핸드폰번호, 닉네임, 생년월일, 성별
    비밀번호의 경우 bcrypt-nodejs모듈을 사용하여 salt값을 만들고, 해싱 값을 DB에 저장
*/
router.post('/signup', function(req, res) {
    if (!req.body.nickname || !req.body.mail || !req.body.passwd || !req.body.name || !req.body.sex || !req.body.hp || !req.body.birth) {
        console.log("client Error" + '\n닉넴 : ' + req.body.nickname + '\n메일 : ' + req.body.mail + '\n비번 : ' + req.body.passwd + '\n이름 : ' + req.body.name + '\n성별 : ' + req.body.sex + '\n폰번 : ' + req.body.hp);
        res.status(200).json({ msg: '1' });
    } else {
        let passwd = req.body.passwd;

        //비밀번호 해싱작업
        bcrypt.genSalt(10, function(error, salt) {
            if (error) {
                console.log('bcrypt.genSalt() errer : ', error.message);
                res.status(503).json({ msg: '2' });
            } else {
                bcrypt.hash(passwd, salt, null, function(error, hash) {
                    if (error) {
                        console.log('hash' + error);
                        res.status(503).json({ msg: '2' });
                    } else {
                        let myInfo = {
                            USER_MAIL: req.body.mail,
                            USER_NAME: req.body.name,
                            USER_PASS: hash,
                            USER_HP: req.body.hp,
                            USER_NICKNAME: req.body.nickname,
                            USER_BIRTH: req.body.birth,
                            USER_SEX: req.body.sex
                        };

                        pool.getConnection(function(error, connection) {
                            if (error) {
                                console.log(error);
                                res.status(503).json({ msg: '3' });
                                connection.release();
                            } else {
                                connection.query('insert into USER set ?', myInfo, function(error, result) {
                                    if (error) {
                                        console.log(error);
                                        res.status(503).json({ msg: '4' });
                                        connection.release();
                                    } else {
                                        res.status(200).json({ msg: '5' });
                                        connection.release();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
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
    if ()
});

router.post('/logout', function(req, res) {

});




module.exports = router;