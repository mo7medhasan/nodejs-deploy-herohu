const products = require("../controller/product.controller.js");
const router = require("express").Router();
const verfiy =require("../controller/verifyTokenapi.controller.js");
const express = require('express');
const path = require('path');
const {upload}= require('../helpers/filehelper');
//CRUD

router.post("/", verfiy.verifyTokenAndAdmin, express.static(path.join(__dirname, 'uploads')), upload.array('files'), products.createProduct); 
router.post("/reviews/:productId", verfiy.verifyToken, products.createProductReview);  
router.put("/:id", verfiy.verifyTokenAndAdmin, express.static(path.join(__dirname, 'uploads')), upload.array('files'), products.updateProduct);

router.get("/", products.getAllProducts); 
router.get("/prdOfSearch", products.getAllProductsOfSearch);
router.get("/:id", products.getProduct); 
router.get("/cat/:category", products.getProductsOfCategory); //
router.get("/subcat/:subCategory", products.getProductsOfSubCategory); //
router.get("/reviews/:productId", products.getProductReviews); 
router.get("/details/:id", products.getProductdetails);//
router.get("/latest/Products", verfiy.verifyToken,products.getlatestProducts);//
router.get("/chart/productCategories", verfiy.verifyTokenAndAdmin,products.getProductCategories);//

router.delete("/:id", verfiy.verifyTokenAndAdmin, products.deleteProduct);
router.put("/:productId/:reviewId", verfiy.verifyToken, products.deleteReview);  
router.post("/filter",  products.getAllProductFilter);  
router.post("/search/:names",  products.getproductname);

////////////////////
router.post("/model",  products.AddmodelElec);
router.put("/up/mod/:id", products.ubdateModel)
module.exports = router;