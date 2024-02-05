const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");
const { verifyToken, isAdmin } = require("../../middleware/auth.js");
const { body, check } = require("express-validator");

router.post("/create", controller.create);
router.get("/list", controller.list);
router.put("/accept", controller.confirm);
router.put("/reject", controller.reject);


module.exports = router;
