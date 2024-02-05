const router = require("express").Router({
    mergeParams: true,
});
const controller = require("./controller");

router.post("/create", controller.create);
router.get('/:cid/list', controller.getMeals);
router.get('/:mid/meal-details', controller.getMealInfo);
router.put('/:mid/edit', controller.edit);
router.delete('/:mid/delete',controller.delete)

module.exports = router;
