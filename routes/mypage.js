const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const pool = require('../config/db_pool');
const check = require('../js/check.js');



//mypage 정보 주기
router.get('/', function(req, res) {
    if (!req || !req.headers["authorization"]) {
        res.status(200).json({
            msg: '1'
        });
    } else {
        const auth = check.checkAuth(req);
        if (!auth) {
            res.status(503).json({
                msg: '2'
            });
        } else {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.log(error);
                    res.status(503).json({
                        msg: '3'
                    });
                    connection.release();
                } else {
                    console.log(auth.user_mail);
                    connection.query('select * from USER where USER_MAIL = ?', auth.user_mail, function(error, result) {
                        if (error) {
                            res.status(503).json({
                                msg: '4'
                            });
                        } else {
                            res.status(200).json({
                                msg: '5',
                                result: result
                            });
                            connection.release();
                        }
                    });
                }
            });
        }
    }
});
// //mypage 정보 주기
// router.get('/', function(req, res) {
//     if (!req.headers["authorization"]) {
//         res.status(200).json({
//             msg: '1'
//         });
//     } else {
//         const token = req.headers["authorization"];
//         const secretKey = req.app.get('jwt-secret');
//         const decoded = jwt.verify(token, secretKey);

//         if (!decoded) {
//             res.status(503).json({
//                 msg: '2'
//             });
//         } else {
//             pool.getConnection(function(error, connection) {
//                 if (error) {
//                     console.log(error);
//                     res.status(503).json({
//                         msg: '3'
//                     });
//                     connection.release();
//                 } else {
//                     console.log(decoded.user_mail);
//                     connection.query('select * from USER where USER_MAIL = ?', decoded.user_mail, function(error, result) {
//                         if (error) {
//                             res.status(503).json({
//                                 msg: '4'
//                             });
//                         } else {
//                             res.status(200).json({
//                                 msg: '5',
//                                 result: result
//                             });
//                             connection.release();
//                         }
//                     });
//                 }
//             });
//         }
//     }
// });


// router.put('/modify', upload.single('profileimg'), function(req, res) {

// });

module.exports = router;