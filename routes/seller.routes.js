const router = require("express").Router();
const seller = require("../controller/seller.controller");
const verfiy = require("../controller/verifyTokenapi.controller.js");
const products = require("../controller/product.controller.js")
const express = require('express');
const path = require('path');
const {upload}= require('../helpers/filehelper');



router.get("/", verfiy.verifyTokenAndAdmin, seller.getAdminOrders);
router.get("/sellerOrders/:id", verfiy.verifyTokenAndAdmin, seller.getsellerOrders);
router.get("/getSellers", verfiy.verifyTokenAndAdmin, seller.getAllSellers);
router.get("/getProd/:id", verfiy.verifyTokenAndAuthorization, seller.getProductdetails);
router.get("/sellerProd", verfiy.verifyTokenAndAuthorization, seller.getProductSeller);
router.get("/getRev/:id", verfiy.verifyTokenAndAuthorization, seller.getProductReviews);
router.get("/getSingleOrder/:id", verfiy.verifyTokenAndAuthorization, seller.getAdminsingleOrders);
router.get("/getOrder/ggg", verfiy.verifyTokenAndAuthorization, seller.getAdminOrders);
router.post("/addproduct", express.static(path.join(__dirname, 'uploads')), upload.array('files'),verfiy.verifyTokenAndAuthorization, products.createProduct);
router.post("/model",  products.AddmodelElec);
router.put("/up/mod/:id",products.ubdateModel);
router.put("/delProd/:id", verfiy.verifyTokenAndAuthorization, seller.deleteProductSeler);
router.put("/updatePro/:id", verfiy.verifyTokenAndAuthorization, express.static(path.join(__dirname, 'uploads')), upload.array('files'), seller.updateProduct);
router.put("/:productId/:reviewId", seller.deleteReview); 
router.get("/totalForAllOrders", verfiy.verifyTokenAndAuthorization, seller.getTotalForDeliveredOrders);
router.post("/commission", verfiy.verifyTokenAndAuthorization, seller.commissionForEachSeller);


module.exports = router;