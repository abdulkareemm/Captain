const router = require('express').Router({
    mergeParams: true,
});
const controller = require('./controller');

/* Tables Router */
const tablesRouter = require('../table/routes');
router.use('/:sid/tables', tablesRouter);

router.post('/create', controller.create);
router.post('/login', controller.login);
router.get('/allEmployers',controller.getAllEmployers)
router.delete("/delete",controller.deleteWaiter)

/// hi 


// exports 
module.exports = router;