const users = require("../controller/user.controller.js");
const verify = require("../controller/verifyTokenapi.controller.js");
const router = require("express").Router();


//UPDATE
router.put("/:id", verify.verifyToken, users.updateUser);
router.get("/checkEmail/:email",users.checkEmail);

// DELETE
router.delete("/:id", verify.verifyTokenAndAuthorization, users.deleteUser); 

//GET USER
router.get("/:id", verify.verifyTokenAndAuthorization,users.getUser);

//GET ALL USERS
router.get("/", verify.verifyTokenAndAdmin,users.getAllUsers);

router.get("/check/forget/:email",users.checkForgetPass);
router.put("/changePass/:email", users.ChangePass);

router.post("/AddNew", verify.verifyTokenAndAdmin,users.AddUserForAdmin);
router.post("/pagination", verify.verifyTokenAndAdmin,users.getAllUserpagination);


module.exports = router;