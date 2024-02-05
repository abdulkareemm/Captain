const router = require('express').Router({
    mergeParams: true,
});
const controller = require('./controller');

router.put('/add', controller.addToCart);

// exports
module.exports = router;