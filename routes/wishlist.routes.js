const router = require("express").Router();
const wishlist = require("../controller/wishlist.controller.js");
const verify = require("../controller/verifyTokenapi.controller.js");


//CREATE WISHLIST
router.post('/', verify.verifyToken, wishlist.createWishList);
//GET USER'S Lists
router.get('/', verify.verifyToken, wishlist.getUserLists);

//GET PRODUCTS OF WISHLIST
router.get('/:wishlistId', verify.verifyToken, wishlist.getProductsInWishLists);

//GET ONE PRODUCT FROM WISHLIST CATEGORY
router.get('/getprd/:productId', verify.verifyToken, wishlist.getProductsInWishLists);

//DELET WISHLIST
router.delete('/:wishlistId', verify.verifyToken, wishlist.deleteWishList);

//UPDATE WISHLIST
router.put('/:id',verify.verifyToken,wishlist.updateWishlist);

//REMOVE PRODUCT FROM WISHLIST
router.delete('/remveItem/:productId', verify.verifyToken, wishlist.deleteProductFromWishList);

module.exports = router;