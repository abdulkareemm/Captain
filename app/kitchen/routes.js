const router = require('express').Router({
    mergeParams: true,
});
const controller = require('./controller');

router.put('/edit', controller.edit);
router.post('/login', controller.login);
router.put('/:oid/status', controller.changeOrderStatus);
router.get('/:oid/order-details', controller.getOrderDetails);
router.get('/orders-list', controller.getOrders);


// export 
module.exports = router;