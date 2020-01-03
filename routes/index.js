var express = require("express");
var router = express.Router();
const controller = require("../controller");

/* GET home page. */
router.get("/", controller.home);
router.get("/auth", controller.auth);
router.post("/write", controller.write);

module.exports = router;