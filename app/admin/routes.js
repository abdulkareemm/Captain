const router = require('express').Router();
const controller = require('./controller');
// const auth = require('../../middleware/auth');

const SubscriptionsRouter = require('../subscription/routes');
//router.use('/:id/subscriptions', SubscriptionsRouter);
// تعديل طلبو طه
router.use("/subscriptions", SubscriptionsRouter);

router.post('/create', controller.create);
router.post('/login', controller.login);
router.get('/list', controller.list);



module.exports = router;