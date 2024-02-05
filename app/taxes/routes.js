const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");

router.post("/create", controller.create);
router.get("/list", controller.list);
router.put("/edit", controller.edit);
router.delete('/delete',controller.delete)
module.exports = router;
