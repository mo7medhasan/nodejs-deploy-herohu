const cart = require("../controller/cart.controller.js");
const verify =require("../controller/verifyTokenapi.controller.js");
const router = require("express").Router();



router.post("/addToCart", verify.verifyToken, cart.addToCart);
router.get("/", verify.verifyToken, cart.getCartItems);
router.get("/:userId", verify.verifyToken, cart.getCart);
router.put("/changeQuantity/:cartId/:productId", verify.verifyToken, cart.changeQuantity);
router.delete("/:productId", verify.verifyToken, cart.deleteItemFromCart);
router.delete("/deleteCart/:cartId", cart.removeCart);




module.exports = router; 