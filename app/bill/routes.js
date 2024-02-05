const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");

router.post('/list',controller.list)
router.get("/:bid/details",controller.billDetails);
module.exports = router;
