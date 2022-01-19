const express = require('express');
const router = express.Router();
const users = require("../controller/auth.controller.js");
const verfiy =require("../controller/verifyTokenapi.controller.js")
const path = require('path');
const { upload } = require('../helpers/filehelper');

//SIGN UP
router.post('/signup', users.signUp);

//LOGIN
router.post('/login', users.login);
router.post('/admin',users.adminLogin);
router.get('/logout', users.logout);

//SELLER
// router.post('/seller/pro/signup', users.sellerSignUp);
router.post('/seller/pro/signup' ,express.static(path.join(__dirname, 'uploads')), upload.single('files'), users.sellerSignUp);
router.post('/seller/pro/login', users.sellerLogin);
//GOOGLE
router.post('/google/signup', users.googleSignUp);
router.post('/google/login', users.googleLogin);

module.exports = router;