const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");
// const auth = require('../../middleware/auth');

/* Kitchen Router */
const kitchenRouter = require("../kitchen/routes");
router.use("/:id/kitchen", kitchenRouter);
/* Table Router */
const tableRouter = require("../table/routes");
router.use("/:id/tables", tableRouter);
/* Staff Router */
const staffRouter = require("../staff/routes");
router.use("/:id/staff", staffRouter);
/* Shift Router */
const shiftRouter = require("../shift/routes");
router.use("/:id/shifts", shiftRouter);
/* Category Router */
const categoryRouter = require("../category/routes");
router.use("/:id/categories", categoryRouter);
/* Meal Router */
const mealRouter = require("../meal/routes");
router.use("/:id/meals", mealRouter);
/* Online Reservations Router */
const onlineReservationRouter = require("../online-reservation/routes");
router.use("/:id/reservations", onlineReservationRouter);
/* Taxes Router */
const taxesRouter = require("../taxes/routes");
router.use("/:id/taxes", taxesRouter);
/*Bill Router */
const BillRouter = require("../bill/routes");
router.use("/:id/bill", BillRouter);

router.post("/create", controller.create);
router.post("/login", controller.login);
router.post("/detail", controller.getResById);
router.get("/getAll", controller.getAll);
router.get("/list", controller.list);
router.put("/delete", controller.delete);
router.put("/active", controller.active);
router.put("/edit", controller.edit);
router.post("/getrestaurant", controller.getRestaurant);

// export router
module.exports = router;
