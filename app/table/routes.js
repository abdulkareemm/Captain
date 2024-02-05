const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");

router.put("/edit", controller.edit);
router.get("/list", controller.getTables);
router.put("/:tid/reserve", controller.reserveTable);
router.put("/:tid/bill", controller.getBillToTable);
router.put("/:tid/close", controller.closeTable);
router.post("/:tid/order", controller.order);
router.put("/:tid/editOrder", controller.editOrder);

router.get("/count", controller.getTablesCount);

// router.use('/:tid/cart', require('../item-cart/routes'));

// exports
module.exports = router;
