const router = require("express").Router({
    mergeParams: true,
});
const controller = require("./controller");

router.post("/create",controller.create);
router.get('/list', controller.getCategories);
router.put('/:cid/edit', controller.editCategory);


module.exports = router;