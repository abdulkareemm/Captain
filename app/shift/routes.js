const router = require('express').Router({
    mergeParams: true,
});
const controller = require('./controller');

router.post('/create', controller.create);

// export 
module.exports = router;