var express = require("express");
var router = express.Router();
const controller = require("../controller");

/* GET home page. */
router.get("/", controller.home);
router.get("/app", controller.app);
router.get("/auth", controller.auth);
router.post("/write", controller.write);
router.get("/listFiles", controller.list);
router.get("/file/:filename", controller.file);

module.exports = router;