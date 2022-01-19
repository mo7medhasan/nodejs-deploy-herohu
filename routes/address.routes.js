const addresses = require("../controller/address.controller.js");
const router = require("express").Router();
const verfiy =require("../controller/verifyTokenapi.controller.js");


router.post("/",  verfiy.verifyTokenAndAuthorization, addresses.addAddress);
router.get("/", verfiy.verifyTokenAndAuthorization, addresses.getAddresses);
router.get("/:id", verfiy.verifyTokenAndAuthorization, addresses.getAddress);
router.get("/get/default", verfiy.verifyTokenAndAuthorization, addresses.getDefaultAddress);
router.put("/:id",  verfiy.verifyTokenAndAuthorization, addresses.EditAddress);
router.put("/default/:id",  verfiy.verifyTokenAndAuthorization, addresses.defaultAddress);
router.delete("/:id",  verfiy.verifyTokenAndAuthorization, addresses.deleteAddress);

router.get("/ForAdmin/:id", verfiy.verifyTokenAndAdmin, addresses.getAddressesByAdmin);
router.post("/byAdmin/:id",  verfiy.verifyTokenAndAuthorization, addresses.addAddressByAdmin);



module.exports = router; 