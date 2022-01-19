const express = require ('express');
const router = express.Router();
const paypalCtrl = require('../controller/paypal.controller.js');

router.post("/pay", paypalCtrl.createPayment);


module.exports = router;