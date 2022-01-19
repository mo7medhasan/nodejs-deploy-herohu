const governates = require("../controller/governate.controller.js");
const router = require("express").Router();
const verfiy =require("../controller/verifyTokenapi.controller.js");

router.post("/",verfiy.verifyTokenAndAdmin,  governates.addGovernate);
router.get("/", verfiy.verifyToken,  governates.GetAllGovernate);

router.put("/:id",verfiy.verifyTokenAndAdmin,  governates.updategove);
router.delete("/:id",verfiy.verifyTokenAndAdmin,  governates.deletegove);


router.get("/:ctryName", verfiy.verifyToken, governates.getGovByCtryName);
router.get("/Gov/:name", verfiy.verifyToken, governates.getGovByName);
router.post("/pagination",  governates.getAllGovernatepagination);


module.exports = router; 