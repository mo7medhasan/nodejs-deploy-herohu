const cities = require("../controller/city.controller.js");
const router = require("express").Router();


router.post("/",  cities.addCity);
router.get("/",  cities.GetAllCities);

router.get("/city/:id",  cities.getcetybyid);
router.delete("/:id",  cities.deletecities);
router.put("/:id",  cities.updateCitie);

router.get("/:GovName", cities.getCitiesByGovName);
router.post("/pagination", cities.getAllCitypagination);

module.exports = router; 