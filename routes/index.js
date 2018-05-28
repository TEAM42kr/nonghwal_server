const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const pool = require('../config/db_pool');
const bcrypt = require('bcrypt-nodejs');
const check = require('../js/check.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


/* GET home/main page. */
router.get('/', function(req, res, next) {

});





module.exports = router;