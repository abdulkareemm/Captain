const router = require("express").Router({
  mergeParams: true,
});
const controller = require("./controller");
const { verifyToken, isAdmin } = require("../../middleware/auth.js");
const { body, check } = require("express-validator");
router.post(
  "/add-subscripe",
  body("name")
    .isLength({ min: 5 })
    .withMessage("name must be at least 5 chars long"),
  body("email").isEmail().withMessage("you should enter Email"),
  body("address")
    .isLength({ min: 5 })
    .withMessage("address must be at least 5 chars long"),
  check("phone").isNumeric().withMessage("input number phone not string"),
  controller.create
);
router.get("/list", controller.list);
router.post("/accept", controller.confirm);

// export router
module.exports = router;
